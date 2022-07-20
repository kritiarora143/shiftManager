import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { DataContext } from '../contexts';
import { bookShift, cancelShift } from '../util/apiHelpers';
import { addFormattedDate, formatTime, groupBy } from '../util/commonHelpers';

const AvailableShifts = () => {

  const { shifts, setShifts } = useContext(DataContext)
  const [segmentedData, setSegmentedData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [data, setData] = useState([])

  const handleIndexChange = (index) => {
    console.log(index)
    setSelectedIndex(index)
    setData(Object.values(segmentedData)[index])
  };

  useEffect(() => {
    setSegmentedData(groupBy(shifts, "area"))
  }, [shifts])

  useEffect(() => {
    if (Object.values(segmentedData)[selectedIndex])
      setData(Object.values(segmentedData)[selectedIndex])
  }, [segmentedData])

  const onPressBookShift = (id) => {
    let newData = data.map(item => {
      if (item.id == id) {
        let newItem = item
        newItem.booked = "loading"
        return newItem
      }
      return item
    })
    setData(newData)
    bookShift(id)
      .then(resp => {
        let newData = [...data.filter(item => item.id !== id), resp.data]
        setData(newData)
        newData = [...shifts.filter(item => item.id !== id), resp.data]
        setShifts(newData)
      })
      .catch(e => {
        let newData = data.map(item => {
          if (item.id == id) {
            let newItem = item
            newItem.booked = false
            return newItem
          }
          return item
        })
        setData(newData)
      })
  }

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
    let overlapping = false
    shifts.filter(shift => shift.booked).forEach(shift => {
      if ((shift.startTime <= item.startTime && shift.endTime >= item.startTime) ||
        (shift.startTime <= item.endTime && shift.endTime >= item.endTime)) {
        overlapping = true
      }
    })
    return (
      <View style={styles.renderItem}>
        <Text style={styles.title}>{`${formatTime(item.startTime)}-${formatTime(item.endTime)}`}</Text>
        {<Text style={{ color: item.booked ? '#4F6C92' : overlapping && '#E2006A' }}>
          {item.booked ? 'Booked' : overlapping && 'Overlapping'}</Text>}

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: item.booked == "loading" ? "#16A64D" : item.booked ? '#E2006A' : overlapping ? '#CBD2E1' : '#16A64D' },

          ]}
          onPress={() => { !item.booked ? onPressBookShift(item.id) : onPressCancelShift(item.id) }}
          disabled={overlapping && !item.booked} // overlapping
        >
          <View
            style={{
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            {item.booked == "loading" ?
              <ActivityIndicator style={{ alignSelf: 'center' }} size="small" color="#16A64D" />
              :
              <Text style={{ color: item.booked ? '#E2006A' : overlapping ? '#CBD2E1' : '#16A64D' }}>
                {!item.booked ? "Book" : "Cancel"}
              </Text>}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedControlTab
        values={Object.keys(segmentedData)}
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChange}
        tabStyle={styles.segmentControl}
        tabTextStyle={styles.tabText}
        activeTabStyle={styles.activeTab}
        activeTabTextStyle={styles.activeTabText}
        badges={Object.values(segmentedData).map(item => `(${item.length})`)}
        tabBadgeStyle={styles.badgeStyle}
        tabBadgeContainerStyle={styles.badgeContainerStyle}
        activeTabBadgeStyle={styles.activeBadgeStyle}
        activeTabBadgeContainerStyle={styles.activeBadgeContainerStyle}
      />
      <SectionList
        sections={sectionData}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.header}>{title}</Text>
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
    padding: 20,
    marginVertical: 8
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#A4B8D3',
    borderBottomWidth: 1,
    backgroundColor: '#F1F4F8'
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
  cancelButton: {
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    marginHorizontal: 20,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 18
  },
  segmentControl: {
    borderWidth: 0,
    backgroundColor: '#F1F4F8',
    height: 50,
    borderColor: '#A4B8D3',
    borderBottomWidth: 1,

  },
  tabText: {
    fontSize: 18,
    color: "#A4B8D3"
  },
  activeTab: {
    backgroundColor: '#F1F4F8'
  },
  activeTabText: {
    color: '#004FB4',
    fontWeight: 'bold',
  },
  badgeStyle: {
    backgroundColor: '#F1F4F8',
    color: '#A4B8D3',
    fontSize: 18,
    fontWeight: 'normal'
  },
  badgeContainerStyle: {
    backgroundColor: '#F1F4F8'

  },
  activeBadgeStyle: {
    color: '#004FB4',
    fontWeight: 'bold'
  },
  activeBadgeContainerStyle: {
    color: '#004FB4',
    backgroundColor: '#F1F4F8'
  }
});

export default AvailableShifts