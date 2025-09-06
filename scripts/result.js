(function () {
    const Result = {
        init() {
            const url = new URL(location.href);
            const total = url.searchParams.get('total');
            const score = url.searchParams.get('score');
            const id = url.searchParams.get('id');
            const answers = url.searchParams.get('answers');

            document.getElementById('result-score').innerText = score + '/' + total;

            document.getElementById('correct').addEventListener('click', () => {
                location.href = 'answers.html?score=' + score + '&total=' + total + '&id=' + id + '&answers=' + answers;
            });
        }
    }
    Result.init();
})();