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
    firebase.database().ref('votes').once('value')
      .then(snap => snap.val())
      .then(data => {
        // patch the new count
        const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1
        return firebase.database().ref('votes').update({ [voteFor]: newCount })
      })
      .catch(console.error)

    document.querySelectorAll('button').forEach(btn => btn.remove())
    document.querySelectorAll('.hidden').forEach(item => item.classList.remove('hidden'))
  }

  firebase.database().ref('votes').on('value', onUpdate)

  function onUpdate (snap) {
    const data = snap.val()

    document.querySelectorAll('h3').forEach(choice => {
      const total = Object.values(data).reduce((acc, val) => acc + val)
      const current = data[choice.closest('.choice').dataset.value]
      choice.innerText = Math.round(current / total * 100) + "%"
    })
  }
}
