import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

export default function App()
{
    let [song, setSong] = useState();
    let [status, setStatus] = useState('Play');
    let [expectedInterval, setExpectedInterval] = useState(1000);
    let [currentInterval, setCurrentInterval] = useState(100);

    useEffect(() =>
    {
        if (!song)
        {
            loadSong();
            return;
        }
        updateProgressUpdateInterval(); // set an initial interval
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
    function update(playback)
    {
        if (!playback.isLoaded && playback.error)
            console.log('Error playing');
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
        let changedInterval = Math.max(1000, expectedInterval + (intervalType == 'more' ? 5000 : 'less' ? -5000 : 0));

        setExpectedInterval(changedInterval);
        setCurrentInterval((await song.setProgressUpdateIntervalAsync(changedInterval)).progressUpdateIntervalMillis);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Click the buttons to change audio interval</Text>
            <View style={styles.row} >
                <Button title='Less' onPress={() => updateProgressUpdateInterval('less')} />
                <Button title={status} onPress={status == 'Play' ? play : pause} />
                <Button title='More' onPress={() => updateProgressUpdateInterval('more')} />
            </View>
            <Text>Expected interval: {expectedInterval}</Text>
            <Text>Current interval: {currentInterval}</Text>
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
