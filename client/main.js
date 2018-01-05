window.onload = () => {
    if (document.querySelector('#form-wrap')) {
        const add_subj_btn = document.querySelector('#addSubjBtn');
        let count = 1;

        const count_input = document.createElement('input');
        count_input.type = 'hidden';
        count_input.name = 'subjects_count';
        document.querySelector('#form-wrap').appendChild(count_input);

        //Listen for subjects addition
        add_subj_btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLabel = document.createElement('label');
            newLabel.innerHTML = 'Subjects';
            newLabel.className = 'subj_label';

            const newdiv = document.createElement('div');
            newdiv.className = 'col';
            newdiv.innerHTML = `<input id="subj_${count}" type='text' class="form-control mb-2 sub" name="subject" placeholder="Subject ${count}">`;

            if (!document.querySelector('.subj_label')) {
                document.querySelector('#form-wrap').insertBefore(newLabel, document.querySelector('.form-row'));
            }
            document.querySelector('.form-row').appendChild(newdiv);
            count_input.value = count;
            count++;
        });
    }

    if (document.querySelector('.marks_form')) {
        document.querySelector('.marks_form').addEventListener('submit', (e) => {
            e.preventDefault();
            const obtained = document.querySelector('.obtained').value;
            const maximum = document.querySelector('.maximum').value;

            console.log(obtained, maximum)
            if (maximum < obtained) {
                console.log('Maximum Marks cannot be less than the obtained marks.');
                document.querySelector('.marks_form').reset();
            }
        });
    }
}