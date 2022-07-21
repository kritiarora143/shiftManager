import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, View,Alert } from "react-native";
import { DataContext } from '../contexts';
import { cancelShift, getShifts } from '../util/apiHelpers';
import { addFormattedDate, formatTime, getTimeDeltaHrs, groupBy } from '../util/commonHelpers';

const MyShifts = () => {

    const [data, setData] = useState([])
    const { shifts, setShifts } = useContext(DataContext)

    useEffect(() => {
        callApi()
    }, [])

    const callApi = () => {
        getShifts()
            .then(resp => setShifts(resp.data))
            .catch(e => Alert.alert("Alert!!", e.response.data.message))
    }

    useEffect(() => {
        setData(shifts.filter(item => item.booked == true))
    }, [shifts])

    const onPressCancelShift = (id) => {
        let newData = data.map(item => {
            if (item.id == id) {
                let newItem = item
                newItem.booked = "loading"
                return newItem
            }
            return item
        })
        setData(newData)
        cancelShift(id)
            .then(resp => {
                let newData = [...data.filter(item => item.id !== id), resp.data]
                setData(newData)
                newData = [...shifts.filter(item => item.id !== id), resp.data]
                setShifts(newData)
            })
            .catch(e => {
                Alert.alert("Alert!!", e.response.data.message)
                let newData = data.map(item => {
                    if (item.id == id) {
                        let newItem = item
                        newItem.booked = true
                        return newItem
                    }
                    return item
                })
                setData(newData)
            })

    }

    var formattedData = addFormattedDate(data)
    const groupedData = groupBy(formattedData, 'formattedDate')
    const sectionData = Object.keys(groupedData).map(item => ({ title: item, data: groupedData[item] }))

    const renderItem = ({ item }) => {
        let disabled = item.startTime < new Date().getTime()
        return (
            <View style={styles.renderItem}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.title}>{`${formatTime(item.startTime)}-${formatTime(item.endTime)}`}</Text>
                    <Text style={[styles.title, styles.areaStyle]}>{item.area}</Text>

                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.cancelButton, { borderColor: item.booked == "loading" ? "#16A64D" : disabled ? '#A4B8D3' : '#E2006A' }]}
                        onPress={() => { onPressCancelShift(item.id) }}
                        disabled={disabled}
                    >
                        {item.booked == "loading" ? <ActivityIndicator style={{ alignSelf: 'center' }} size="small" color="#16A64D" /> :
                            <Text style={{ color: disabled ? '#A4B8D3' : '#E2006A' }}>{'Cancel'}</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <SectionList
                sections={sectionData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title, data } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.header}>{title}</Text>
                        <Text style={styles.subHeader}>{`${data.length} ${data.length == 1 ? 'shift' : 'shifts'},`}</Text>
                        <Text style={styles.subHeader}>{`${data.reduce((b, a) => getTimeDeltaHrs(a.startTime, a.endTime) + b, 0)} h`}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: 'white',
    },
    header: {
        fontSize: 15,
        backgroundColor: "#F1F4F8",
        color: '#4F6C92',
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingLeft: 25
    },
    subHeader: {
        fontSize: 15,
        backgroundColor: "#F1F4F8",
        color: '#A4B8D3',
        paddingLeft: 15
    },
    title: {
        fontSize: 15,
        color: '#4F6C92',
        marginLeft: 17
    },
    buttonText: {
        color: 'F1F4F8'
    },
    areaStyle: {
        color: '#A4B8D3'
    },
    renderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#A4B8D3',
        borderBottomWidth: 1,
        paddingVertical: 6,
        backgroundColor: '#F7F8FB',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#A4B8D3',
        borderBottomWidth: 1,
        backgroundColor: '#F1F4F8'
    },
    cancelButton: {
        backgroundColor: '#F7F8FB',
        borderWidth: 1,
        marginHorizontal: 20,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderRadius: 18
    }


});
export default MyShifts