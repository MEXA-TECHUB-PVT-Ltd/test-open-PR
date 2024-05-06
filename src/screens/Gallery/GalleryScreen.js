import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';

const GalleryScreen = () => {
    const [images, setImages] = useState([]);
  
    useEffect(() => {
      fetchImages();
    }, []);
  
    const fetchImages = async () => {
      try {
        const galleryPath = RNFS.DocumentDirectoryPath + '/DCIM/Camera';
  
        const files = await RNFS.readDir(galleryPath);

        if (!files) {
            console.error(`The folder "${files}" doesn't exist.`);
            return;
          }
  
        const imageFiles = files.filter((file) => file.isFile() && file.name.endsWith('.jpg'));
  
        setImages(imageFiles);
      } catch (error) {
        console.error('Error fetching images: ', error);
      }
    };
  
    const renderItem = (item, index) => (
      <TouchableOpacity key={index} onPress={() => handleImagePress(item)}>
        <Image style={styles.image} source={{ uri: 'file://' + item.path }} />
      </TouchableOpacity>
    );
  
    const handleImagePress = (selectedImage) => {
      // Handle image press, e.g., open a modal with the selected image
      console.log('Selected Image:', selectedImage);
    };
  
    return (
      <View style={styles.container}>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderItem(item, index)}
          numColumns={3} // Adjust the number of columns as needed
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    image: {
      width: 100,
      height: 100,
      margin: 5,
      borderRadius: 5,
    },
  });
  
  export default GalleryScreen;
  
