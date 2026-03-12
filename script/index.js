// create synonym buttons
const createElement = (arr) => {
    const htmlElement = arr.map((e1) => `<span class="btn">${e1}</span>`);
    return htmlElement.join(" ");
};

// spinner control
const manageSpinner = (status) => {

    const spinner = document.getElementById("spinner");
    const wordContainer = document.getElementById("word-container");

    if (status) {
        spinner.classList.remove("hidden");
        wordContainer.classList.add("hidden");
    } else {
        spinner.classList.add("hidden");
        wordContainer.classList.remove("hidden");
    }
};


// load all lessons
const loadLessons = () => {

    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLesson(json.data));

};


// remove active button
const removeActive = () => {

    const lessonButtons = document.querySelectorAll(".lesson-btn");

    lessonButtons.forEach((btn) =>
        btn.classList.remove("active")
    );

};


// load words by level
const loadLevelWord = (id) => {

    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
        .then(res => res.json())
        .then((data) => {

            removeActive();

            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");

            displayLevelWord(data.data);

        });

};


// load word details
const loadWordDetail = async (id) => {

    const url = `https://openapi.programming-hero.com/api/word/${id}`;

    const res = await fetch(url);

    const details = await res.json();

    displayWordDetails(details.data);

};


// show word details in modal
const displayWordDetails = (word) => {

    const detailsBox = document.getElementById("details-container");

    detailsBox.innerHTML = `
    
        <div>
            <h2 class="text-2xl font-bold">
                ${word.word}
                (<i class="fa-solid fa-microphone"></i>: ${word.pronunciation})
            </h2>
        </div>

        <div>
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
        </div>

        <div>
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
        </div>

        <div>
            <h2 class="font-bold">Synonym</h2>

            <div>
                ${createElement(word.synonyms)}
            </div>

        </div>
    `;

    document.getElementById("word_modal").showModal();

};


// show words in card
const displayLevelWord = (words) => {

    const wordContainer = document.getElementById("word-container");

    wordContainer.innerHTML = "";


    if (words.length == 0) {

        wordContainer.innerHTML = `

        <div class="text-center col-span-full rounded py-10 space-y-4 font-bangla">

            <img class="mx-auto" src="/assets/alert-error.png"/>

            <p class="text-xl font-medium text-gray-500">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>

            <h2 class="font-bold text-3xl">
            নেক্সট Lesson এ যান
            </h2>

        </div>

        `;

        manageSpinner(false);

        return;
    }


    words.forEach((word) => {

        const card = document.createElement("div");

        card.innerHTML = `

        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">

            <h2 class="font-bold text-2xl">
                ${word.word ? word.word : "Word is not found"}
            </h2>

            <p class="font-semibold">
                Meaning / Pronunciation
            </p>

            <div class="text-2xl font-medium font-bangla">

                "${word.meaning ? word.meaning : "Meaning is not found"
            } 
                ${word.pronunciation ? word.pronunciation : "Pronunciation not found"
            }"

            </div>


            <div class="flex justify-between items-center">

                <button 
                onclick="loadWordDetail(${word.id})"
                class="btn bg-[#1A91FF30] hover:bg-[#1A91FF90]">

                <i class="fa-solid fa-circle-info"></i>

                </button>


                <button class="btn bg-[#1A91FF30] hover:bg-[#1A91FF90]">

                <i class="fa-solid fa-volume-high"></i>

                </button>

            </div>

        </div>

        `;

        wordContainer.append(card);

    });

    manageSpinner(false);

};


// show lesson buttons
const displayLesson = (lessons) => {

    const levelContainer = document.getElementById("level-container");

    levelContainer.innerHTML = "";

    for (let lesson of lessons) {

        const btnDiv = document.createElement("div");

        btnDiv.innerHTML = `

            <button 
            id="lesson-btn-${lesson.level_no}" 
            onclick="loadLevelWord(${lesson.level_no})" 
            class="btn btn-outline btn-primary lesson-btn">

            <i class="fa-solid fa-book"></i>

            Lesson - ${lesson.level_no}

            </button>

        `;

        levelContainer.append(btnDiv);

    }

};


// start app
loadLessons();