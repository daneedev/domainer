document.addEventListener('DOMContentLoaded', function() {
    const typewriter = document.getElementById('typewriter');
    const words = ['yourname', 'coolapp', 'mysite', 'awesome', 'project'];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let deleteSpeed = 50;
    let pauseBetweenWords = 2000;
    let pauseBeforeDelete = 1500;

    function type() {
        const currentWord = words[currentWordIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                setTimeout(type, pauseBetweenWords);
                return;
            }
            setTimeout(type, deleteSpeed);
        } else {
            typewriter.textContent = currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, pauseBeforeDelete);
                return;
            }
            setTimeout(type, typeSpeed);
        }
    }

    type();
});