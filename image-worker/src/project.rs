use std::fs::File;
use std::path::Path;

use image::{self, DynamicImage, ImageFormat, GenericImage};

use commands::{Command, CommandResult};

pub struct Project {
    path: Option<String>,
    image: DynamicImage,
    // undo stack has latest command at the end
    // and oldest command at the beginning
    undo_stack: Vec<Box<Command>>,
    // redo stack is emptied every time a command
    // is performed
    // otherwise it contains the most recently undone
    // command at the top (last item)
    redo_stack: Vec<Box<Command>>,
}

impl Project {
    pub fn new(width: u32, height: u32) -> Project {
        Project::from_image(None, DynamicImage::new_rgba8(width, height))
    }

    pub fn load(path: &str) -> Result<Project, String> {
        if path.is_empty() {
            return Err("Cannot load empty path".to_owned());
        }

        let path_string = path.to_owned();

        let path = Path::new(path);
        let image = image::open(path).map_err(|e| format!("{}", e))?;
        let image = match image {
            DynamicImage::ImageRgba8(_) => image,
            img => DynamicImage::ImageRgba8(img.to_rgba()),
        };

        Ok(Project::from_image(Some(path_string), image))
    }

    pub fn from_image(path: Option<String>, image: DynamicImage) -> Project {
        Project {
            path: path,
            image: image,
            undo_stack: Vec::new(),
            redo_stack: Vec::new(),
        }
    }

    pub fn get_path(&self) -> Option<String> {
        self.path.clone()
    }

    pub fn save(&mut self, path: &str) -> CommandResult {
        if path.is_empty() {
            return Err("Cannot save empty path".to_owned());
        }
        match self.image.dimensions() {
            (0, 0) | (0, _) | (_, 0) => Err("Cannot save image with dimension equal to zero".to_owned()),
            _ => Ok(()),
        }?;

        let path_string = path.to_owned();

        let path = Path::new(path);
        // Need to normalize extension
        let extension = path.extension()
            .and_then(|s| s.to_str())
            .map_or("".to_string(), |s| s.to_lowercase());
        let format = match &extension[..] {
            "jpg" | "jpeg" => ImageFormat::JPEG,
            "png" => ImageFormat::PNG,
            ext => return Err(format!("Unsupported extension: {}", ext))
        };

        let mut f = File::create(path).map_err(|e| format!("{}", e))?;
        self.image.save(&mut f, format).map_err(|e| format!("{}", e))?;

        self.path = Some(path_string);

        Ok(())
    }

    pub fn perform_command(&mut self, command: Box<Command>) -> CommandResult {
        command.forward(self)?;
        self.undo_stack.push(command);
        self.redo_stack.clear();

        Ok(())
    }

    pub fn can_undo(&self) -> bool {
        !self.undo_stack.is_empty()
    }

    pub fn undo(&mut self) -> CommandResult {
        if !self.can_undo() {
            return Err("Nothing to undo".to_owned());
        }

        let command = self.undo_stack.pop().unwrap();
        command.backward(self)?;

        self.redo_stack.push(command);

        Ok(())
    }

    pub fn can_redo(&self) -> bool {
        !self.redo_stack.is_empty()
    }

    pub fn redo(&mut self) -> CommandResult {
        if !self.can_redo() {
            return Err("Nothing to redo".to_owned());
        }

        let command = self.redo_stack.pop().unwrap();
        command.forward(self)?;

        self.undo_stack.push(command);

        Ok(())
    }

    // For use in commands only
    pub fn get_image(&self) -> &DynamicImage {
        &self.image
    }

    // For use in commands only
    pub fn apply_to_image<F>(&mut self, f: F)
        where F: FnOnce(&mut DynamicImage) -> DynamicImage {

        self.image = f(&mut self.image);
    }
}
