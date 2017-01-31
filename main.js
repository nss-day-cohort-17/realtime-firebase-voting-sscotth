{
  document
    .querySelectorAll('.choice button')
    .forEach(btn => btn.addEventListener('click', onVote))

  function onVote (evt) {
    // submit the vote
    const voteURL = 'https://c17-voting.firebaseio.com/votes.json'

    // // what button i clicked on
    const voteFor = evt.target.closest('.choice').dataset.value

    // // go get the current counts
    fetch(voteURL)
      .then(res => res.json())
      .then(data => {
        // patch the new count
        const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1

        return fetch(voteURL, {
          method: 'PATCH',
          body: JSON.stringify({ [voteFor]: newCount })
        })
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
