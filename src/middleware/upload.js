import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory for buffer (not local disk)
const upload = multer({ storage });

export default upload;
