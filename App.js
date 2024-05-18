import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

let counter = 0;

export default function App()
{
    let [song, setSong] = useState();
    let [status, setStatus] = useState('Play');
    let [progressUpdateInterval, setProgressUpdateInterval] = useState(1000);

    // console.log('Re-render');

    useEffect(() =>
    {
        if (!song)
        {
            loadSong();
            return;
        }
        setIntitialInterval();
        play();

        if (song)
            return () =>
            {
                song.unloadAsync();
            }
    },
        [song]);

    async function loadSong()
    {
        let { sound } = await Audio.Sound.createAsync(require('./assets/Blackbear Idfc.mp3'));
        sound.setOnPlaybackStatusUpdate(update);
        setSong(sound);
    }
    async function setIntitialInterval()
    {
        await song.setProgressUpdateIntervalAsync(1000);
    }
    function update(playback)
    {
        if (!playback.isLoaded && playback.error)
            console.log('Error playing');

        console.log(counter++);
        // React.useState()'s doesn't work here
    }

    async function play()
    {
        if (!song)
            return;
        await song.playAsync();
        setStatus('Pause');
    }
    async function pause()
    {
        if (!song)
            return;
        await song.pauseAsync();
        setStatus('Play');
    }

    async function updateProgressUpdateInterval(intervalType)
    {
        let changedInterval = Math.max(1000, progressUpdateInterval + (intervalType == 'more' ? 5000 : 'less' ? -5000 : 0));

        await song.setProgressUpdateIntervalAsync(changedInterval);
        setProgressUpdateInterval(changedInterval);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Click the buttons to change audio interval: {progressUpdateInterval}ms</Text>
            <View style={styles.row} >
                <Button title='Less' onPress={() => updateProgressUpdateInterval('less')} />
                <Button title={status} onPress={status == 'Play' ? play : pause} />
                <Button title='More' onPress={() => updateProgressUpdateInterval('more')} />
            </View>
            <Text>Please open the console to see the update counter</Text>
        </View>
    );
}

let styles = StyleSheet.create(
    {
        container:
        {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center'
        },
        row:
        {
            flexDirection: 'row',
            padding: 25,
            gap: 25
        }
    }
);
