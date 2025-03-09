import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';


interface State { // describes structure of the state object
  items?: AgendaSchedule; // optional property, agendaschedule is expected type for items
}

export default class AgendaScreen extends Component<State> { 
  state: State = { // stores components data
    items: undefined // this holds schedule data for calendar, emtpy at start
  };

  // reservationsKeyExtractor = (item, index) => {
  //   return `${item?.reservation?.day}${index}`;
  // };

  render() {
    return (
      <Agenda
        
        items={this.state.items}
        loadItemsForMonth={this.loadItems} // navigates to a new month
        selected={'2025-09-03'} // default date when opened
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true} // expand or collapse the agenda
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'} // shows year only
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        // renderDay={this.renderDay}
        // hideExtraDays={false}
        // showOnlySelectedDayItems
        // reservationsKeyExtractor={this.reservationsKeyExtractor}
      />
    );
  }

  loadItems = (day: DateData) => {
    const items = this.state.items || {};

    setTimeout(() => { // simulate loading data, adds an intentional delay
      }, 1000);
  };


  renderDay = (day: { getDay: () => string | number | boolean  
	 }) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem}/>;
  }; // how the day is displayed in the calendar


  renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14; // font size for the text
    const color = isFirst ? 'black' : '#43515c'; // color of the text based on whether it is first or not

    return (
      <TouchableOpacity
        
        style={[styles.item, {height: reservation.height}]} // applies style
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  // to display a msg when there are no tasks for a specific date
  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}> 
        <Text>This is empty date</Text>
      </View>
    );
  };

  // to know if agenda needs to be re rendered
  rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name; // if the name of the task is different, it will be re rendered
  };

  // converts timestamps to strings
  timeToString(time: number) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({ // styles for the components 
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  }
});