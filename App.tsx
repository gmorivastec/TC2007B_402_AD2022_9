
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MapView, {PROVIDER_GOOGLE, enableLatestRenderer, LatLng, Marker } from 'react-native-maps';

// hay más de 1 renderer de mapas de google
// renderer - el código que dibuja el mapa en pantalla
enableLatestRenderer();

function App() {

  const[usuario, setUsuario] = useState("");
  const[password, setPassword] = useState("");
  const[initializing, setInitializing] = useState(true);
  const[user, setUser] = useState();
  const[nombre, setNombre] = useState("");
  const[peso, setPeso] = useState(0.0);
  var lista: LatLng[] = [];
  const [markers, setMarkers] = useState(lista);

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

  useEffect(() => {

    const funcionDesuscribir = firestore()
    .collection("Perritos")
    .onSnapshot(perritos => {
      console.log("SUSCRIPCION!");
      perritos.docs.forEach(perritoActual => {        
        console.log("nombre: " + perritoActual.data().nombre + " peso: " + perritoActual.data().peso);
      });
    });

    return funcionDesuscribir;
  }, []);

  if(initializing){
    return (
      <ActivityIndicator size={"large"}/>
    );
  }

  return (
    <View>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>HOLA CAMBIO RÁPIDO</Text>
      <Text style={{fontSize: 10, fontWeight: 'bold', color: 'red'}}>HOLA CAMBIO RÁPIDO</Text>
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
      <TextInput 
        placeholder='nombre del perrito'
        onChangeText={(text) => {
          setNombre(text);
        }}
      />
      <TextInput 
        placeholder='peso del perrito'
        onChangeText={(text) => {
          setPeso(parseFloat(text));
        }}
      />
      <View style={styles.botoncito}>
        <Button 
          title='agregar nuevo documento a colección'
          onPress={() => {
            firestore()
            .collection("Perritos")
            .add({
              nombre: nombre,
              peso: peso,
            })
            .then(() => {
              console.log("perrito agregado");
            });
          }}
        />
      </View>
      <View style={styles.botoncito}>
        <Button 
          title='hacer query a colección'
          onPress={() => {
            firestore()
            .collection("Perritos")
            .get()
            .then(perritos => {

              perritos.docs.forEach(perritoActual => {
                console.log("nombre: " + perritoActual.data().nombre + " peso: " + perritoActual.data().peso);
              });
            });
          }}
        />
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapContainer}
        region={{
          latitude: 20.734804,
          longitude:-103.457384,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}

        onPress={event => {
          console.log(event.nativeEvent.coordinate);
          setMarkers(markers.concat(event.nativeEvent.coordinate));
        }}
      >
        {
          markers.length > 0 && markers.map((actual, i) => (<Marker coordinate={actual} key={i} />))
        }
      </MapView>
    </View>
  );
}


// si les late investigar chequen flexbox
// así funciona el orden ahí

const styles = StyleSheet.create({

  contenedor: {
    flexDirection: 'row',
    height: 20
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
  },
  mapContainer: {
    height: "100%",
    width: "100%",
  },
  map: {
    height: "100%",
    width: "100%",
  }
});

export default App;
