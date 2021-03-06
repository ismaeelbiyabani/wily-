import React from 'react';
import { StyleSheet, Text, TextInput,Image, TouchableOpacity, View,KeyboardAvoidingView, ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as firebase from 'firebase'
import db from '../config'
import { disableExpoCliLogging } from 'expo/build/logs/Logs';
export default class TransactionScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            hascamerapermissions: null,
            scanned: false,
            scannedata: '',
            buttonstate: 'normal'
        }

    }
    getcamerapermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hascamerapermissions: status === "granted"
        })
    }
    handlebarcodescanned = async ({ type, data }) => {
        this.setState({
            scanned: true,
            scannedata: data,
            buttonstate: 'normal'
        })
    }
    handleTransaction= async ()=>{
        var Transactionmessage=null;
        db.collections("books").doc(this.state.scannedbookid).get()
        .then((doc)=>{
            var book=doc.data()
            if(book.bookAvalability){
                this.initiatebookissue();
                Transactionmessage="book issued"  
                ToastAndroid.show(Transactionmessage,ToastAndroid.SHORT)
            }
else{
    this.initiatebookreturn();
    Transactionmessage="book returned"
    ToastAndroid.show(Transactionmessage,ToastAndroid.SHORT)
}
})
this.setState({
    Transactionmessage:Transactionmessage
})
}
initiatebookissue=async()=>{
db.collection("transaction").add({
    'studentid':this.state.scannedstudentid,
    'bookid':this.state.scannedbookid,
    'data':firebase.firestore.Timestamp.now().toDate(),
    'transactiontype':"issue"
})
db.collection("books").doc(this.state.scannedbookid).update({
    'bookAvailibility':false
})
db.collection("students").doc(this.state.scannedstudentid).update({
'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
}) 
}
initiatebookreturn=async()=>{
    db.collection("transaction").add({
        'studentid':this.state.scannedstudentid,
        'bookid':this.state.scannedbookid,
        'data':firebase.firestore.Timestamp.now().toDate(),
        'transactiontype':"return"
    })
    db.collection("books").doc(this.state.scannedbookid).update({
        'bookAvailibility':true
    })
    db.collection("students").doc(this.state.scannedstudentid).update({
    'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
    }) 
    }
    
    render() {
        const hascamerapermissions = this.state.hascamerapermissions;
        const scanned = this.state.scanned;
        const buttonstate = this.state.buttonstate;
        if (buttonstate === "clicked" && hascamerapermissions) {
            return (
                <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handlebarcodescanned}>

                </BarCodeScanner>
            )
        }
        else if (buttonstate === "normal") {
            return (
                <KeyboardAvoidingView style= {styles.container} behavior="padding" enabled>
                    
                
                
                    <View>

<Image source={require("../assets/booklogo.jpg")}

style={{width:200,height:200}}

/>
<Text style={{textAlign:'center',fontSize:30}}>WILY</Text>

                    </View>
                    <View style={styles.inputview}> 
                    
                    <TextInput style={styles.inputbox}
                    
                    placeholder="BOOK ID"
                    onChangeText={text=>this.setState({scannedbookid:text})}
          value={this.state.scannedbookid}/>
<TouchableOpacity style={styles.scanbutton}
onPress={()=>{
    this.getcamerapermissions("BOOK ID")
}}>
    <Text style={styles.buttontext}>scan</Text>

</TouchableOpacity>
</View>
<View style={styles.inputview}> 
                    
                    <TextInput style={styles.inputbox}
                    
                    placeholder="STUDENT ID"
                    onChangeText={text=>this.setState({scannedstudentid:text})}
          value={this.state.scannedstudentid}/>
<TouchableOpacity style={styles.scanbutton}
onPress={()=>{
    this.getcamerapermissions("STUDENT ID")
}}>
               <Text style={styles.buttontext}>
             scan
                    </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.submitbutton}
onPress={async()=>{
  var Transactionmessage=this.handleTransaction();
  this.setState(
      {scannedbookid:'',
    scannedstudentid:''})
    }}>
        <Text style={styles.submitbuttontext}>
            SUBMIT
        </Text>
 </TouchableOpacity>
 </KeyboardAvoidingView>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    displaytext: {
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    scanbutton: {
        backgroundColor: '#2196F3',
        padding: 10,
        margin: 10,

    },
    buttontext: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    },
    inputview:{
flexDirection:'row',
margin:20,
    },
    inputbox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    },
});























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































