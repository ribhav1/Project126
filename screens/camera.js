import * as React from 'react'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker';
import { Button, View, Image, Platform } from 'react-native'

export default class PickImage extends React.Component {
    state = {
        image: null,
    }

    getPermissionAsync = async() => {
        if (Platform.OS !== 'web') {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, We Need Camera Roll Permissions to Make this Work')
            }
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').length-1]
        let type = "image/${uri.split('.')[uri.split('.').length-1]}"
        const file_to_upload = {
            uri: uri,
            name: filename,
            type: type,
        }
        data.append('digit', file_to_upload)
        fetch('https://f292a3137990.ngrok.io/predict-digit', { 
            method:'POST', 
            body: data,
            headers: {
                'content-type': 'multipart/form-data',
            }
        })
        .then((response) => response.json())
        .then((result) => {
            console.log('Success: ', result)
        })
        .catch(error => {
            console.error('Error: ', error)
        })
    }

    _pickImage = async() => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            console.log('work')
            if (!result.cancelled) {
                this.setState({
                    image: result.data
                })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(E) {
            console.log(E)
        }

    }

    componentDidMount() {
        this.getPermissionAsync()
    }

    render() {
        let { image } = this.state
        return ( 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title='Pick An Image From Camera Roll' onPress={this._pickImage} />
                {image && <Image source={{ uri: image }} />}
            </View>
        )
    }

}