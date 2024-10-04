//DISCLAIMER:

// i made this function so i could insert new videos from youTube automaticly but since
// my API KEY allows ony for a finite amount of requests per day i preferred not
// to use it because although i don't expect a lot of traffic to this site
// (since it's just a personal portfolio) i still wouldn't want showing an empty section
// or one full of errors. Feel free to use it though. You will need to activate your on key
// using YouTube's API @ https://developers.google.com/youtube/v3

// const API_KEY = "";

// const CHANNEL_ID = "UCPExb53bppH_4nvn82cbBWg";
// const URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`;

// const videoLoad = async function () {
//   try {
//     const request = await fetch(URL);

//     if (!request.ok) {
//       throw new Error(`HTTP error! Status: ${request.status}`);
//     }
//     const data = await request.json();

//     // const items = data.items;

//     data.items.reverse().forEach((item, index) => {
//       if (item.id.kind === "youtube#video") {
//         const videoId = item.id.videoId;
//         const title = item.snippet.title;
//         const thumbnail = item.snippet.thumbnails.medium.url;
//         const markup = `<div class="videoElement flex">
//         <a  href="https://www.youtube.com/watch?v=${videoId}" target="_blank" clipNumber="${index}">
//         <img class="videoClip" src="${thumbnail}" alt="${title}"> </div>`;
//         videoContainer.insertAdjacentHTML("afterbegin", markup);
//       }
//     });

//     console.log(data.items);
//   } catch (err) {
//     console.warn(err.message);
//   }
// };

// videoLoad();
