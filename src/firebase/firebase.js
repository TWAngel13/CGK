const admin = require("firebase-admin");
const {getStorage, ref, uploadBytes} = require("firebase-admin/storage");
const serviceAccount = require("../../cgkdev-53300.json");
module.exports = class FireBase {
    static storageImages;
    static init(){
        const firebaseConfig = {
            credential: admin.credential.cert(serviceAccount),
        };
        admin.initializeApp(firebaseConfig);
        const storage = admin.storage().bucket("cgkdev-53300.appspot.com");
        this.storageImages = storage;
    }
    static async uploadImage(file,imageId){
        const stream = file;
        this.storageImages.file(`images/${imageId}.png`).save(stream);
    }
    static getImageUrl(imageId){
        const url = `https://firebasestorage.googleapis.com/v0/b/cgkdev-53300.appspot.com/o/images%2F${imageId}.png?alt=media`;
        return url;
    }
}