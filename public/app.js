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

async function Errorsweet(message) {
  Swal.fire({
    position: "center",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 3500,
  });
}

async function Successsweet(message) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3500,
  });
}

const app = Vue.createApp({
  data() {
    return {
      inputText: null,
      sentences: null,
      index: 0,
      shuffledSentenceSelected: null,
      SenteceInput: "",
      currentAnswer: "",
      isCorrect: false,
      isUncorrect: false,
      isImport: true,
      isDone: false,
      isImportSentences: true,
      sentenceCount: 0,
      takeSentenceNum:10
    };
  },
  methods: {
    async start() {
      if (this.inputText == null) {
        Errorsweet("Insert Text");
        return;
      }

      if (this.inputText.trim() == "") {
        Errorsweet("Insert Text");
        return;
      }

      const lines = this.inputText.split("<br>");
      const Words = lines[0].replace("\n", " \n ");
      const temp=Words.split("\n");
      const temp2 = temp.filter((e) => String(e).trim());
      this.sentences = this.shuffleArray(temp2).slice(0,this.takeSentenceNum);
      this.sentenceCount = this.sentences.length;
      this.isDone = false;
      this.isImport = true;
      this.isCorrect = false;
      this.isUncorrect = false;
      this.SenteceInput = "";
      this.index = 0;
      this.isImportSentences = false;
      this.practice();
    },
    shuffleArray: function(array) {

      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
         const temp = array[i];
       array[i] = array[j];
         array[j] = temp;
      }    
     
     return array;
  },
    async practice() {
      this.currentAnswer=this.sentences[this.index];
      const sen1 = this.currentAnswer.split(" ");
      const sen2 = this.shuffleArray(sen1);
      this.shuffledSentenceSelected = sen2.filter((e) => String(e).trim());
    },
    async addWord(word, btnNum) {
      this.SenteceInput = this.SenteceInput + " " + word;
      document.querySelector(btnNum).disabled = true;
    },
    async checkSentece() {
      const btnLog = document.querySelector("#btnMain");

      if (this.isCorrect) {
        if (this.isDone) {
          this.isImportSentences = true;
          return;
        }
        this.index = this.index + 1;

        if (this.index > this.sentenceCount - 1) {
          btnLog.innerHTML = "Done";
          this.isDone = true;
          document.querySelector("#btnRest").style.display = "none";
          return;
        }

        this.practice();
        this.isCorrect = false;
        this.isImport = true;
        this.SenteceInput = "";
        btnLog.innerHTML = "Check";
        this.deselectButtons();
        document.querySelector("#btnRest").disabled = false;
      } else if (this.isUncorrect) {
        this.practice();
        this.isUncorrect = false;
        this.isImport = true;
        this.SenteceInput = "";
        btnLog.innerHTML = "Check";
        this.deselectButtons();
        document.querySelector("#btnRest").disabled = false;
      } else {
        if (
          this.SenteceInput.replace(/\s/g, "") ===
          this.currentAnswer.replace(/\s/g, "")
        ) {
          this.isCorrect = true;
          this.isImport = false;
          btnLog.innerHTML = "Next";
          document.querySelector("#btnRest").disabled = true;
        } else {
          this.isUncorrect = true;
          this.isImport = false;
          document.querySelector("#btnRest").disabled = true;
          btnLog.innerHTML = "Try Again";
        }
      }
    },
    async showAnswer() {
      const toastTrigger = document.getElementById("liveToastBtn");
      const toastLiveExample = document.getElementById("liveToast");
      if (toastTrigger) {
        toastTrigger.addEventListener("click", () => {
          const toast = new bootstrap.Toast(toastLiveExample);

          toast.show();
        });
      }
    },
    async deselectButtons() {

      for (let i = 0; i < this.shuffledSentenceSelected.length; i++) {
        document.querySelector("#btn" + i).disabled = false;
      }
    },
    async resetAnswer() {
      this.deselectButtons();
      this.SenteceInput="";
    },
    async exitApp(){
      if(this.isImportSentences){
        window.close();
      }
      else{
        this.isImportSentences=true;
      }
      document.getElementById("btncloseModal").click();
    },
  },
  computed: {
    InputSentenceCount: function() {
      let Num=0;
      if(this.inputText!=null)
      {
        const lines = this.inputText.split("<br>");
        const Words = lines[0].split("\n");
        const temp2 = Words.filter((e) => String(e).trim());
        Num=temp2.length;
      }
      return Num;
  }
  },
});

app.mount("#app");

window.onload = function () {
  var delayInMilliseconds = 3000;
  setTimeout(function () {
    document.querySelector("#container").style.display = "flex";
    document.querySelector("#overlay").style.display = "none";
  }, delayInMilliseconds);
};
