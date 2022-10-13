
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';

import auth from '@react-native-firebase/auth';

function App() {

  const[usuario, setUsuario] = useState("");
  const[password, setPassword] = useState("");
  const[initializing, setInitializing] = useState(true);
  const[user, setUser] = useState();

  // funcion para lidiar con cambio de usuario conectado
  function onAuthStateChanged(user: any){
    setUser(user);
    if(initializing) setInitializing(false);
    console.log("USUARIO INICIALIZADO: ");
    console.log(user);
  }

  useEffect(() => {
    
    // esta invocación regresa una función de limpieza  
    const funcionDesuscribir = auth().onAuthStateChanged(onAuthStateChanged);
    
    // en los effects cuando regresas una función esta se ejecuta en el desmontaje
    // a manera de limpieza
    return funcionDesuscribir;
  }, []);

  if(initializing){
    return (
      <ActivityIndicator size={"large"}/>
    );
  }

  return (
    <View>
      <Text style={{fontSize: 40, fontWeight: 'bold', color: 'red'}}>HOLA CAMBIO RÁPIDO</Text>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>HOLA CAMBIO RÁPIDO</Text>
      <View style={styles.contenedor}>
        <Text style={styles.texto1}>A</Text>
        <Text style={styles.texto2}>B</Text>
        <Text style={styles.texto3}>C</Text>
      </View>
      <TextInput 
        placeholder='user'
        onChangeText={(text) => {
          setUsuario(text);
        }}
      />
      <TextInput 
        placeholder='password'
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry={true}
      />
      <View style={styles.botoncito}>
        <Button 
          title='registrar usuario'
          onPress={() => {
            // similar a lo que hicimos en nativo siempre nos referimos al método
            auth()
            .createUserWithEmailAndPassword(usuario, password)
            .then(() => {
              console.log("USUARIO CREADO EXITOSAMENTE");
            }).catch(error => {
              
              console.log("error: " + error);
              console.log("code: " + error.code);
            });
          }}
        />
      </View>
      <View style={styles.botoncito}>
        <Button 
          title='login'
          onPress={() => {
            auth()
            .signInWithEmailAndPassword(usuario, password)
            .then(() => {
              console.log("USUARIO HIZO LOGIN EXITOSAMENTE");
            }).catch(error => {
              
              console.log("error: " + error);
              console.log("code: " + error.code);
            });
          }}
        />
      </View>
      <View style={styles.botoncito}>
        <Button 
          title='logout'
          onPress={() => {
            auth().signOut().then(() => {
              console.log("USUARIO SALIÓ EXITOSAMENTE");
            });
          }}
        />
      </View>
    </View>
  );
}


// si les late investigar chequen flexbox
// así funciona el orden ahí

const styles = StyleSheet.create({

  contenedor: {
    flexDirection: 'row',
    height: 200
  },
  texto1: {
    backgroundColor: '#fcad03',
    flex: 1
  },
  texto2: {
    backgroundColor: '#20fc03',
    flex: 2
  },
  texto3: {
    backgroundColor: '#03a9fc',
    flex: 1
  },
  botoncito: {
    padding: 5
  }

});

export default App;
