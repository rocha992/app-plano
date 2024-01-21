
function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        // Autenticação bem-sucedida
        const user = userCredential.user;
        console.log('Usuário autenticado:', user);
        window.location.href = 'index.html'; // Redirecionar para a página principal após o login
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erro de autenticação:', errorCode, errorMessage);
      });
  }
  