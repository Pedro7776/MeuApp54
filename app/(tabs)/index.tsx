
//para rodar, abra o terminal, escreva: npx expo start --tunnel   escaneie o qr code no seu celular

import { useEffect, useRef } from 'react';
 /* esse UseRef serve para guardar um valor que pode mudar durante a execução do aplicativo sem fazer
 a tela ser renderizada novamente toda vez. no caso o valor a ser guardado é a animação
 
 
 já o useEffect, ele serve para executar código 
 quando o componente é carregado ou quando alguma coisa muda. o que vai mudar é o horário*/


import { Animated, Pressable, StyleSheet, Text, } from 'react-native';
/* Animated é o padrão de animações do react
 esse pressable já tava no codigo antes, é por conta de um botão
 stylesheet basicamente o estilo geral da aplicação
 text é puramente texto.
*/

const DAY_COLOR = '#F8E8D8';
const NIGHT_COLOR = '#473A2F';
//essas cores são as saturadas que o thur mandou
//pesquisei no google qual seria o codigo, pode nao ser exato.



/* a função homescreen basicamente mostra a tela, não tem muito segredo, 
export default utiliza a mesma tela em outros lugares */
export default function HomeScreen() {
  const colorProgress = useRef(new Animated.Value(0)).current; 
   /* essa const é importante, esse animetd.value começa em 0 pq a genta ta transicionando valores né, 
   então dia seria tipo um 0 e a noite 1 */

  useEffect(() => { /* aqui a gente começa o codigo que vai ser carregado quando abrir a tela */
    const updateColor = () => { /* essa função ela descobre o horário atual e decidid qual deve ser o nível de iluminação. */
      const now = new Date(); //new Date() pega a data e hora atual do dispositivo.
      const hour = now.getHours(); // pega apenas a hora
      const minute = now.getMinutes(); // pega os minutos

      const currentTime = hour + minute / 60; /*transforma hora e minuto em dados, números. 
      pq tem isso? pq o calculo do computador fica mais organizado*/

      let progress: number; 
      /* a variavel progress vai pegar a hora e os minutos transformados em numeros 
      e fazer a o progresso, então tipo:  dia = 0, noite = 1, ai as cores vão mudando até chegar no 1 (0.2, 0.5, 0.7, 1)*/

      // 06:00 - começa o dia
      // 12:00 - dia completo
      if (currentTime >= 6 && currentTime < 12) {
        progress = 1 - (currentTime - 6) / 6; /* a variavel progress que eu mencionei, 
        fazendo a porcentagem  1 - (6 - 6) / 6, 1 - 0 = 1, ou seja, o valor inicial 1
        */
      }

      // 12:00 dia completo
      // 18:00  começa a noite
      else if (currentTime >= 12 && currentTime < 18) {
        progress = (currentTime - 12) / 6; //nesse caso ele vai escurecendo até chegar na outra cor,
      }

      // 18:00 → 05:59 = noite
      else {
        progress = 1;
      } //Se não estiver entre 06:00 e 18:00, significa que estamos no período noturno.

      Animated.timing(colorProgress, { //pra animar o valor colorProgress
        toValue: progress, //Leve o valor atual até o progress que calculamos.
        duration: 2000, // a animação tem 2 segundos
        useNativeDriver: false, /* O driver nativo do React Native não suporta todas as propriedades, 
        incluindo essa interpolação de cor da maneira que estamos fazendo, então mete que é falso*/
      }).start(); //start é pra começar a animação
    };

    updateColor(); //inicia a função que criamos

    // Atualiza a cada minuto
    const interval = setInterval(updateColor, 60 * 1000); /* a cada minuto, updateColor() é executada novamente. 
    Assim o aplicativo consegue perceber que o horário mudou. */

    return () => clearInterval(interval); //Quando o efeito precisar ser encerrado:cancele o intervalo
  }, []); // quando o efeito deve ser executado novamente. Esse efeito não depende de nenhuma variável externa que precise fazer ele rodar novamente.”
  const backgroundColor = colorProgress.interpolate({
    inputRange: [0, 1], // 0 - começo, 1 - fim
    outputRange: [DAY_COLOR, NIGHT_COLOR],// 0 - bege dia, 1 - marrom noite
  });

  // eu acho que não é necessário comentar aqui, é basicamente texto, botão e style e o alerta, tudo visto em devmobile
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor, // cor calculada dinamicamente
        },
      ]}
    >
      <Text style={styles.title}>
        Meu primeiro aplicativo
      </Text>

      <Text style={styles.subtitle}>
        Ebaa
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => alert(' Palestina Livre')}
      >
        <Text style={styles.buttonText}>
          Clique aqui
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});