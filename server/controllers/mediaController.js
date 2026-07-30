const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const config = require('../config/config');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.ogg', '.mov']);
const DOC_EXTS = new Set(['.pdf']);

class MediaController {
  async uploadMedia(req, res, next) {
    try {
      const { dataUrl } = req.body;
      const match = String(dataUrl || '').match(/^data:((image|video|application)\/(png|jpeg|jpg|webp|gif|mp4|webm|ogg|mov|pdf));base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Fayl turi qabul qilinmadi" });
      }

      const type = match[2];
      const subtype = match[3];
      const base64Data = match[4];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileId = crypto.randomBytes(8).toString('hex');
      let filename = `${Date.now()}-${fileId}.${subtype === 'jpeg' ? 'jpg' : subtype}`;
      let finalUrl = `/uploads/${filename}`;

      // Ensure directory
      fs.mkdirSync(config.uploadsDir, { recursive: true });

      const tempPath = path.join(config.uploadsDir, filename);
      fs.writeFileSync(tempPath, buffer);

      // If it's an image, perform Sharp auto-conversion to WebP and compression
      if (type === 'image') {
        const webpFilename = `${Date.now()}-${fileId}.webp`;
        const webpPath = path.join(config.uploadsDir, webpFilename);

        try {
          await sharp(tempPath)
            .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);

          // Generate a thumbnail
          const thumbFilename = `thumb-${Date.now()}-${fileId}.webp`;
          const thumbPath = path.join(config.uploadsDir, thumbFilename);
          await sharp(webpPath)
            .resize(300, 200, { fit: 'cover' })
            .webp({ quality: 75 })
            .toFile(thumbPath);

          // Clean up original non-webp file to save storage
          fs.unlinkSync(tempPath);

          filename = webpFilename;
          finalUrl = `/uploads/${webpFilename}`;
        } catch (sharpError) {
          // Fallback to original image if sharp fails
        }
      }

      return res.status(200).json({ url: finalUrl, type });
    } catch (err) {
      next(err);
    }
  }

  async getMedia(req, res, next) {
    try {
      const files = fs.existsSync(config.uploadsDir)
        ? fs.readdirSync(config.uploadsDir).map(name => {
            const ext = path.extname(name).toLowerCase();
            const stat = fs.statSync(path.join(config.uploadsDir, name));
            return {
              name,
              url: `/uploads/${name}`,
              type: IMAGE_EXTS.has(ext) ? "image" : VIDEO_EXTS.has(ext) ? "video" : DOC_EXTS.has(ext) ? "document" : "other",
              size: stat.size,
              createdAt: stat.birthtimeMs,
            };
          }).filter(f => f.type !== "other").sort((a, b) => b.createdAt - a.createdAt)
        : [];
      return res.status(200).json({ media: files });
    } catch (err) {
      next(err);
    }
  }

  async deleteMedia(req, res, next) {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(config.uploadsDir, filename);
      if (fs.existsSync(filePath) && filePath.startsWith(config.uploadsDir)) {
        fs.unlinkSync(filePath);
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MediaController();
