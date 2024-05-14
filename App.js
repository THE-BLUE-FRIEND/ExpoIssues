import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

export default function App()
{
    let [song, setSong] = useState();
    let [status, setStatus] = useState('Play');
    let [speed, setSpeed] = useState(0);
    let [correctsPitch, setCorrectsPitch] = useState(false);

    useEffect(() =>
    {
        if (!song)
            loadSong();
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

    async function setRate(speedType)
    {
        let changeRate = speedType == 'faster' ? 0.25 : -0.25;

        await song.setRateAsync(Math.pow(2, speed + changeRate), correctsPitch);
        setSpeed(speed + changeRate);
    }
    async function changePitchStatus()
    {
        await song.setRateAsync(Math.pow(2, speed), !correctsPitch);
        setCorrectsPitch(!correctsPitch);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Click the buttons to change audio status</Text>
            <View style={styles.row} >
                <Button title='Slow' onPress={() => setRate('slower')} />
                <Button title={status} onPress={status == 'Play' ? play : pause} />
                <Button title='Fast' onPress={() => setRate('faster')} />
            </View>
            <Button title={'Corrects pitch: ' + correctsPitch} onPress={changePitchStatus} />
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
