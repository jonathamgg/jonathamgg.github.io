const videoPlayer = document.querySelector('#video-player iframe');
const videoUrl = document.querySelectorAll('.video-box');

const defaultVideo = videoUrl[0].getAttribute('data-iframe');
videoPlayer.setAttribute('src', defaultVideo);


videoUrl.forEach( video => {
    video.addEventListener('click', (e) => {
        let url= video.getAttribute('data-iframe');
        let currentUrl = videoPlayer.getAttribute('src');
        let videoChecked = returnVideoBox(videoUrl, currentUrl)
        
        if (video.classList !== videoChecked.classList){
            videoChecked.classList.remove('v-checked');
            video.classList.add('v-checked');
        }
        videoPlayer.setAttribute('src', url);
        console.log(url)


    })
})

function returnVideoBox( videos, url ){
    let result;
    videos.forEach( video => {
        if ( video.getAttribute('data-iframe') === url){
            result = video;
        }
    })

    return result;
}
