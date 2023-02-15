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

var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function() {
    var text = reader.result;
    var node = document.getElementById('output');
    node.value  = text;
    console.log(reader.result.substring(0, 200));
  };
  reader.readAsText(input.files[0]);
};


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
      isQuestion: false,
      isSearchQuestion: false,
      sentenceCount: 0,
      takeSentenceNum:10,
      currentQuestion:'',
      currentAnswer:'',
      ShowTheAnswer:false,
      indexQuestion:0,
      Questions:[],
      textForSearchQuestion: "",
      QuestionsSearchList:[],
      QuestionsCount: 0,
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

      const chkbox=document.querySelector('#chkQuestion');

      if(chkbox.checked==true)
      {
        this.Questions=[];
        this.indexQuestion=0;
        this.isDone=false;
        this.ShowTheAnswer=false;
        this.isSearchQuestion=false;
        const ques=this.inputText.split("<br>");
        console.log(ques);
        const quess = ques[0].replace("\n", " \n ");
        console.log(quess);
        const tempp=quess.split("\n");
        console.log(tempp);
         this.Questions=[];
        let q='';
        let answer='';

        for (let item=0;item<=tempp.length;item++)
        {
          if(tempp[item]==""|| item==tempp.length)
          {
            this.Questions.push({
              id:item,
              qu:q,
              ans:answer
            });
            q='';
            answer='';
          }
          if(q=='')
          {
            q=tempp[item];
          }
          else{
            answer=answer+tempp[item]+'\n';
          }

         
        }
        this.Questions = this.shuffleArray(this.Questions).slice(0,this.takeSentenceNum);
        this.currentQuestion=this.Questions[this.indexQuestion].qu;
        this.currentAnswer=this.Questions[this.indexQuestion].ans;
        this.isImportSentences = false;
        this.isQuestion=true;
        this.QuestionsCount = this.Questions.length;
        console.log(this.Questions);
        console.log(this.QuestionsCount);
        console.log("quuuuuuuu");

      }
      else{
        const lines = this.inputText.split("<br>");
        const Words = lines[0].replace("\n", " \n ");
        const temp=Words.split("\n");
        const temp2 = temp.filter((e) => String(e).trim());
        this.sentences = this.shuffleArray(temp2).slice(0,this.takeSentenceNum);
        this.sentenceCount = this.sentences.length;
        this.isQuestion=false;
        this.isDone = false;
        this.isImport = true;
        this.isCorrect = false;
        this.isUncorrect = false;
        this.SenteceInput = "";
        this.index = 0;
        this.isImportSentences = false;
        this.practice();
      }


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
    async btnQuestion(){
      if(this.ShowTheAnswer){
        console.log(this.indexQuestion);
        if(this.indexQuestion==this.QuestionsCount-1)
        {         
          this.isDone=true;
          return;
        }
        document.getElementById('btnQuestion').innerText="Answer";
        this.ShowTheAnswer=false;
        this.indexQuestion=this.indexQuestion+1;
        console.log(this.Questions);
        console.log(this.Questions[this.indexQuestion].qu);
        this.currentQuestion=this.Questions[this.indexQuestion].qu;
        this.currentAnswer=this.Questions[this.indexQuestion].ans;
      }
      else{
       document.getElementById('btnQuestion').innerText="Next";
        this.ShowTheAnswer=true;
       
      }
      
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
  },
  searchResult() {

    let templist = this.Questions;

    if (this.textForSearchQuestion.trim() != '' && this.textForSearchQuestion) {
      let templist2 = templist.slice(1, 3);
      let xxx = this.textForSearchQuestion.toUpperCase().split(" ");

      for (i = 0; i < xxx.length; i++) {
          templist2 = [];
          templist2 = templist.filter((item) => {
              return item.qu
                  .toUpperCase()
                  .includes(xxx[i].toUpperCase()) ||item.ans
                  .toUpperCase()
                  .includes(xxx[i].toUpperCase())
          });
          templist = [];
          templist = templist2;
      }
      return templist;
    }
    else{
      return [];
    }

    
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
