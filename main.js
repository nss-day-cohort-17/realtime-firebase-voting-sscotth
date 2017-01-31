{
  firebase.initializeApp({
    apiKey: 'AIzaSyDF235EkOk0ZBodnGkNqak5Q7Y0OxVdNr4',
    authDomain: 'c17-voting.firebaseapp.com',
    databaseURL: 'https://c17-voting.firebaseio.com',
    storageBucket: 'c17-voting.appspot.com',
    messagingSenderId: '68201900162',
  })

  document
    .querySelectorAll('.choice button')
    .forEach(btn => btn.addEventListener('click', onVote))

  function onVote (evt) {
    // submit the vote
    const voteURL = 'https://c17-voting.firebaseio.com/votes.json'

    // // what button i clicked on
    const voteFor = evt.target.closest('.choice').dataset.value

    // // go get the current counts
    // fetch(voteURL)
    //   .then(res => res.json())
    firebase.database().ref('votes').once('value')
      .then(snap => snap.val())
      .then(data => {
        // patch the new count
        const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1

        // return fetch(voteURL, {
        //   method: 'PATCH',
        //   body: JSON.stringify({ [voteFor]: newCount })
        // })
        return firebase.database().ref('votes').update({ [voteFor]: newCount })
        .then(() => {
          document.querySelectorAll('h3').forEach(choice => {
            const total = Object.values(data).reduce((acc, val) => acc + val)
            const current = data[choice.closest('.choice').dataset.value]
            choice.innerText = Math.round(current / total * 100) + "%"
          })
        })
      })
      .catch(console.error)

    document.querySelectorAll('button').forEach(btn => btn.remove())
  }
}
