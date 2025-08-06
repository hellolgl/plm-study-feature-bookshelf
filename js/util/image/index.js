import {Image} from "react-native"

export const getImageSize = async (uri) => new Promise(resolve => {
    Image.getSize(uri, (width, height) => {
        console.log(" img size: ", width, height)
        resolve([width, height])
    })
})