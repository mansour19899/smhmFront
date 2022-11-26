if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function () {
        console.log("Service worker registered!");
      })
      .catch(function (e) {
        console.error("SW Errors while registering!", e);
      });
  });
}

const app = Vue.createApp({
  data() {
    return {
      userId: 2,
      matches: null,
      users: null,
      predictionsList: null,
      allPredictionsList: null,
      title: "",
      userNameShow: "",
      addd: "https://localhost:7233",
      allow: true,
    };
  },
  methods: {
    async getMatch() {
      if (this.allow) {
        await fetch(this.addd + "/api/Match")
          .then((res) => res.json())
          .then((data) => (this.matches = data))
          .then(console.log(this.matches))
          .catch((err) => console.log(err.message));
      }
    },
    async getPredictions() {
      if (this.allow) {
        await fetch(this.addd + "/api/predictions/" + this.userId)
          .then((res) => res.json())
          .then((data) => (this.predictionsList = data))
          .then(console.log(this.predictionsList))
          .catch((err) => console.log(err.message));
      }
    },
    async getUsers() {
      if (this.allow) {
        await fetch(this.addd + "/api/User")
          .then((res) => res.json())
          .then((data) => (this.users = data))
          .then(console.log(this.users))
          .catch((err) => console.log(err.message));
      }
    },
    async getAllPredictions(index) {
      if (this.allow) {
        console.log(this.predictionsList[index].matchId);

        await fetch(this.addd + "/api/AllPredictions/" + this.predictionsList[index].matchId)
          .then((res) => res.json())
          .then((data) => (this.allPredictionsList = data))
          .then(console.log(this.allPredictionsList))
          .catch((err) => console.log(err.message));
      }
    },
    async UpdatePredictions(index) {
      if (this.allow) {
        await console.log("#b" + this.predictionsList[index].id);
        const btnSend = document.querySelector(
          "#b" + this.predictionsList[index].id
        );
        btnSend.innerHTML = "Sending...";
        btnSend.disabled = true;

        let _data = this.predictionsList[index];
        let _res = "";
        console.log(_data);
        console.log(
          this.addd + "/api/Predictions/" + this.predictionsList[index].id
        );
        await fetch(
          this.addd + "/api/Predictions/" + this.predictionsList[index].id,
          {
            method: "PUT",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        )
          .then((response) => response.json())
          .catch((err) => console.log(err));

        this.predictionsList[index].done = true;
        btnSend.innerHTML = "Updated";
        btnSend.disabled = false;
      }
    },
    async UpdateMatch(index) {
      if (this.allow) {
        await console.log("#bm" + this.matches[index].id);
        const btnSend = document.querySelector("#bm" + this.matches[index].id);
        btnSend.innerHTML = "Sending...";
        btnSend.disabled = true;

        let _data = this.matches[index];
        let _res = "";
        console.log(_data);
        console.log(this.addd + "/api/match/" + this.matches[index].id);
        await fetch(this.addd + "/api/match/" + this.matches[index].id, {
          method: "PUT",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then((response) => response.json())
          .catch((err) => console.log(err));

        btnSend.innerHTML = "Updated";
        btnSend.disabled = false;
      }
    },
  },
  computed: {},
});

app.mount("#app");
