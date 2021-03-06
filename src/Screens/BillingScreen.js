import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  CheckBox,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../Styles/Color';
import InputField from '../Components/InputField';
import InputButton from '../Components/InputButton';
import ClickableCounter from '../Components/ClickableCounter';
import DeletableText from '../Components/DeletableText';

import firestore from '@react-native-firebase/firestore';

export default class BillingScreen extends Component {
  constructor(props) {
    super(props);

    this.idNumbers = [];
    this.quantities = [];
    this.totalSnaps = props.route.params.totalSnaps;
    console.log('Total snaps is ' + this.totalSnaps);

    this.state = {
      detailer: props.route.params.detailer.toUpperCase(),
      clicker: props.route.params.clicker.toUpperCase(),
      camera: props.route.params.camera.toUpperCase(),
      snapno: 1,
      isHigherDegree: false,
      isPhD: false,
      isOutstation: false,
      IDNumber: '',
      Quantity: 1,
      editingText: '',
      description: '',
      currIdx: 0,
      isLoading: true,
      sameAs: '',
    };

    if (props.route.params.snapNum) {
      const snapShot = firestore()
        .collection(this.state.camera)
        .doc(String(this.props.route.params.snapNum))
        .get({source: 'cache'})
        .then(docSnapshot => {
          this.idNumbers = docSnapshot.data().idNumbers;
          this.quantities = docSnapshot.data().quantities;
          this.setState({
            isLoading: false,
            isOutstation: docSnapshot.outstation,
            description: docSnapshot.description,
            snapno: this.props.route.params.snapNum,
            currIdx: this.idNumbers.length,
          });
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
          firestore()
            .collection(this.state.camera)
            .doc(String(this.props.route.params.snapNum))
            .get()
            .then(docSnapshot => {
              this.idNumbers = docSnapshot.data().idNumbers;
              this.quantities = docSnapshot.data().quantities;
              this.setState({
                isLoading: false,
                isOutstation: docSnapshot.outstation,
                description: docSnapshot.description,
                snapno: this.props.route.params.snapNum,
                currIdx: this.idNumbers.length,
              });
            });
        });
    } else {
      this.setState({snapno: this.totalSnaps + 1, isLoading: false});
    }
  }

  componentDidMount() {
    if (this.props.route.params.snapNum) {
      this.totalSnaps = this.props.route.params.totalSnaps;
      const snapShot = firestore()
        .collection(this.state.camera)
        .doc(String(this.props.route.params.snapNum))
        .get({source: 'cache'})
        .then(docSnapshot => {
          this.idNumbers = docSnapshot.data().idNumbers;
          this.quantities = docSnapshot.data().quantities;
          this.setState({
            isLoading: false,
            isOutstation: docSnapshot.outstation,
            description: docSnapshot.description,
            snapno: this.props.route.params.snapNum,
            currIdx: this.idNumbers.length,
          });
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
          firestore()
            .collection(this.state.camera)
            .doc(String(this.props.route.params.snapNum))
            .get()
            .then(docSnapshot => {
              this.idNumbers = docSnapshot.data().idNumbers;
              this.quantities = docSnapshot.data().quantities;
              this.setState({
                isLoading: false,
                isOutstation: docSnapshot.outstation,
                description: docSnapshot.description,
                snapno: this.props.route.params.snapNum,
                currIdx: this.idNumbers.length,
              });
            });
        });
    } else {
      this.idNumbers = [];
      this.quantities = [];
      this.totalSnaps = this.props.route.params.totalSnaps;
      this.setState({snapno: this.totalSnaps + 1, isLoading: false});
    }
  }

  handleOutstationChange = () => {
    this.setState({isOutstation: !this.state.isOutstation});
  };

  handleDegreeChange = () => {
    this.setState({isHigherDegree: !this.state.isHigherDegree});
  };

  handlePhDChange = () => {
    this.setState({isPhD: !this.state.isPhD});
  };

  handleIDNumberChange = IDNumber => {
    this.setState({IDNumber: IDNumber});
  };

  handleIDNumberSubmit = () => {
    if (/^\d+$/.test(this.state.IDNumber) && this.state.IDNumber.length == 6) {
      let actualID = this.state.isHigherDegree
        ? 'H' + this.state.IDNumber
        : this.state.IDNumber;
      actualID = this.state.isPhD
        ? 'P' + this.state.IDNumber
        : this.state.IDNumber;
      if (this.state.currIdx == this.idNumbers.length) {
        this.idNumbers.push(actualID);
        this.quantities.push(this.state.Quantity);
      } else {
        this.idNumbers[this.state.currIdx] = actualID;
        this.quantities[this.state.currIdx] = this.state.Quantity;
      }
      this.setState({
        IDNumber: '',
        Quantity: 1,
        currIdx: this.idNumbers.length,
      });
    }
  };

  handlePlus = () => {
    this.setState({Quantity: this.state.Quantity + 1});
  };

  handleMinus = () => {
    this.setState({Quantity: this.state.Quantity - 1});
  };

  handleTextEdit = textEdit => {
    const isHD = textEdit.title.includes('H');
    const isPhD = textEdit.title.includes('P');

    this.setState({
      IDNumber: textEdit.title,
      Quantity: textEdit.quantity,
      isHigherDegree: isHD,
      isPhD: isPhD,
      currIdx: this.idNumbers.indexOf(textEdit.title),
    });
  };

  handleTextDelete = textDelete => {
    const index = this.idNumbers.indexOf(textDelete.title);
    this.idNumbers.splice(index, 1);
    this.quantities.splice(index, 1);
    this.setState(this.state);
  };

  handleDescriptionChange = description => {
    this.setState({description: description});
  };

  handleSameAsChange = sameAs => {
    this.setState({sameAs: sameAs});
  };

  handleSameAsSubmit = () => {
    if (!(this.state.sameAs === '')) {
      this.setState({isLoading: true});
      firestore()
        .collection(this.state.camera)
        .doc(this.state.sameAs)
        .get({source: 'cache'})
        .then(docSnapshot => {
          const tempIDArr = docSnapshot.data().idNumbers;
          const tempQuantArr = docSnapshot.data().quantities;
          this.idNumbers = [...new Set(this.idNumbers.concat(tempIDArr))];
          this.quantities = [...new Set(this.quantities.concat(tempQuantArr))];
          this.setState({
            isLoading: false,
            currIdx: this.idNumbers.length,
            sameAs: '',
          });
        })
        .catch(function(error) {
          console.error('Error writing document: ', error);
          firestore()
            .collection(this.state.camera)
            .doc(this.state.sameAs)
            .get()
            .then(docSnapshot => {
              const tempIDArr = docSnapshot.data().idNumbers;
              const tempQuantArr = docSnapshot.data().quantities;
              this.idNumbers = [...new Set(this.idNumbers.concat(tempIDArr))];
              this.quantities = [
                ...new Set(this.idNumbers.concat(tempQuantArr)),
              ];
              this.setState({
                isLoading: false,
                currIdx: this.idNumbers.length,
                sameAs: '',
              });
            });
        });
    }
  };

  handleSnapSubmit = () => {
    firestore()
      .collection(this.state.camera)
      .doc(String(this.state.snapno))
      .set({
        clicker: this.state.clicker,
        detailer: this.state.detailer,
        description: this.state.description,
        outstation: this.state.isOutstation,
        idNumbers: this.idNumbers,
        quantities: this.quantities,
      })
      .then(function() {
        console.log('Document successfully written!');
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });

    console.log(this.totalSnaps);
    console.log(this.state.snapno);

    this.idNumbers = [];
    this.quantities = [];
    this.setState({
      isOutstation: false,
      IDNumber: '',
      Quantity: 1,
      editingText: '',
      description: '',
      currIdx: 0,
      snapno: this.totalSnaps + 2,
    });
    this.totalSnaps += 1;

    console.log(this.state.snapno);
  };

  goPrevious = () => {
    if (this.state.snapno == 1) {
      alert("Can't go back!!");
      return;
    }

    this.setState({isLoading: true});

    firestore()
      .collection(this.state.camera)
      .doc(String(this.state.snapno - 1))
      .get({source: 'cache'})
      .then(docSnapshot => {
        this.idNumbers = docSnapshot.data().idNumbers;
        this.quantities = docSnapshot.data().quantities;
        this.setState({
          isLoading: false,
          isOutstation: docSnapshot.outstation,
          description: docSnapshot.description,
          snapno: this.state.snapno - 1,
          currIdx: this.idNumbers.length,
        });
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
        firestore()
          .collection(this.state.camera)
          .doc(String(this.state.snapno - 1))
          .get()
          .then(docSnapshot => {
            this.idNumbers = docSnapshot.data().idNumbers;
            this.quantities = docSnapshot.data().quantities;
            this.setState({
              isLoading: false,
              isOutstation: docSnapshot.outstation,
              description: docSnapshot.description,
              snapno: this.state.snapno - 1,
              currIdx: this.idNumbers.length,
            });
          });
      });
  };

  goNext = () => {
    if (this.state.snapno == this.totalSnaps) {
      alert("Can't go to the next!!");
      return;
    }

    this.setState({isLoading: true});

    firestore()
      .collection(this.state.camera)
      .doc(String(this.state.snapno + 1))
      .get({source: 'cache'})
      .then(docSnapshot => {
        this.idNumbers = docSnapshot.data().idNumbers;
        this.quantities = docSnapshot.data().quantities;
        this.setState({
          isLoading: false,
          isOutstation: docSnapshot.outstation,
          description: docSnapshot.description,
          snapno: this.state.snapno + 1,
          currIdx: this.idNumbers.length,
        });
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
        firestore()
          .collection(this.state.camera)
          .doc(String(this.state.snapno + 1))
          .get()
          .then(docSnapshot => {
            this.idNumbers = docSnapshot.data().idNumbers;
            this.quantities = docSnapshot.data().quantities;
            this.setState({
              isLoading: false,
              isOutstation: docSnapshot.outstation,
              description: docSnapshot.description,
              snapno: this.state.snapno + 1,
              currIdx: this.idNumbers.length,
            });
          })
          .catch(function(error) {
            console.log('Error getting document:', error);
            throw error;
          });
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.background}>
          <Text style={styles.infoHeader}>Loading...</Text>
        </View>
      );
    } else {
      const keyBoardType = this.state.isOutstation ? 'default' : 'idno';

      return (
        <View style={styles.background}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 1}} onPress={this.goPrevious}>
              <Text
                style={[
                  styles.infoHeader,
                  {textAlign: 'left', marginLeft: 10, fontSize: 16},
                ]}>
                {'<'} Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={this.goNext}>
              <Text
                style={[
                  styles.infoHeader,
                  {textAlign: 'right', marginRight: 10, fontSize: 16},
                ]}>
                Next {'>'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[{flex: 1, textAlign: 'center'}, styles.infoHeader]}>
              Clicker: {this.state.clicker}
            </Text>
            <Text style={[{flex: 1, textAlign: 'center'}, styles.infoHeader]}>
              Detailer: {this.state.detailer}
            </Text>
            <Text style={[{flex: 1, textAlign: 'center'}, styles.infoHeader]}>
              Camera: {this.state.camera}
            </Text>
          </View>
          <Text style={[{textAlign: 'center'}, styles.infoHeader]}>
            Snap number: {this.state.snapno}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <CheckBox
                value={this.state.isOutstation}
                onValueChange={this.handleOutstationChange}
              />
              <Text style={styles.infoHeader}>Outstation</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <CheckBox
                value={this.state.isHigherDegree}
                onValueChange={this.handleDegreeChange}
              />
              <Text style={styles.infoHeader}>Higher Degree</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <CheckBox
                value={this.state.isPhD}
                onValueChange={this.handlePhDChange}
              />
              <Text style={styles.infoHeader}>PhD</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <InputField
              labelText="ID Number"
              inputType={keyBoardType}
              blurOnSubmit={false}
              writeText={this.state.IDNumber}
              onChangeText={this.handleIDNumberChange}
              onSubmitEditing={this.handleIDNumberSubmit}
            />
            <ClickableCounter
              defaultNum={this.state.Quantity}
              onPlus={this.handlePlus}
              onMinus={this.handleMinus}
            />
          </View>
          <ScrollView>
            <InputField
              labelText="Description"
              inputType="default"
              writeText={this.state.Description}
              onChangeText={this.handleDescriptionChange}
            />
            <InputField
              labelText="Same As"
              inputType="idno"
              writeText={this.state.sameAs}
              onChangeText={this.handleSameAsChange}
              onSubmitEditing={this.handleSameAsSubmit}
            />
          </ScrollView>
          <ScrollView>
            <View style={{flex: 1, alignItems: 'center', padding: 20}}>
              {this.idNumbers.map((info, i) => (
                <DeletableText
                  title={info}
                  quantity={this.quantities[i]}
                  parentCallback={this.handleTextEdit}
                  parentDeleteCallback={this.handleTextDelete}
                  customItemStyle={{height: 25}}
                  customTextStyle={{fontSize: 14}}
                />
              ))}
            </View>
          </ScrollView>
          <KeyboardAvoidingView style={{alignItems: 'flex-end'}}>
            <InputButton onPress={this.handleSnapSubmit} />
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  background: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.black,
  },
  infoHeader: {
    fontSize: 12,
    color: colors.white,
    marginBottom: 10,
  },
});
