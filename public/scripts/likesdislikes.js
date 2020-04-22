window.onload = function () {
    const likesBtn = document.getElementById('likesBtn')
    const dislikesBtn = this.document.getElementById('dislikesBtn')

    likesBtn.addEventListener('click', function (e) {
        let postId = likesBtn.dataset.post

        reqLikeDislike('likes', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? 'Liked' : 'Like'
                likeText = likeText + `(${data.totalLikes})`
                let dislikeText = "Dislike" + `(${data.totaldislikes})`

                likesBtn.innerHTML = likeText
                dislikesBtn.innerHTML = dislikeText
            })
            .catch(e => {
                alert(e.response.data.error)
            })
    })

    dislikesBtn.addEventListener('click', function (e) {
        let postId = likesBtn.dataset.post

        reqLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
                dislikeText = dislikeText + `(${data.totaldislikes})`
                let likeText = "Like" + `(${data.totalLike})`

                likesBtn.innerHTML = likeText
                dislikesBtn.innerHTML = dislikeText
            })
            .catch(e => {
                alert(e.response.data.error)
            })
    })


}

function reqLikeDislike(type, postId) {
    let headers = new Headers();
    headers.append('Accept', 'Application/JSON')
    headers.append('Content-Type', 'application/json')

    let req = new Request(`/api/${type}/${postId}`, {
        method: "GET",
        headers,
        mode: 'cors',
    })

    return fetch(req)
}