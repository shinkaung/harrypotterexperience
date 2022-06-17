function fillCalendarWithMonth(year,month){
    fetch(`month/${year}-${month}`)
    .then(r=>r.json())
    .then(r=>{
        document.getElementById('month-year').innerText = r['month-name'] + ' ' + r['month-year'];
        document.getElementById('btn-next').onclick = ()=>{
            if (month<12){
                fillCalendarWithMonth(year,month+1);
            }else{
                fillCalendarWithMonth(year+1,1);
            }
        };
        document.getElementById('btn-prev').onclick = ()=>{
            //What should we do if month == 1
            fillCalendarWithMonth(year,month-1);
        };
        let alltr = document.querySelectorAll('#calender-table tr');
        for (var i = alltr.length - 1; i > 1; i--) {
            alltr[i].remove();
        }
        let prevTd = null;
        for(let w of r.weeks){
            let tr = document.createElement('tr');
            for (let day of w){
                let td = document.createElement('td');
                td.innerText = day.whn.split('-')[2];
                let freeslot = day.free;
                if(freeslot == 0){
                    td.classList.add('bg-sold-out');
                } else if(month != day.whn.split('-')[1]){
                    td.classList.add('bg-not-cmon');
                } else {
                td.classList.add('bg-available');   
                td.onclick = () => {
                    if(prevTd != null){
                        prevTd.classList.remove('bg-selected');
                        prevTd.classList.add('bg-available');
                    }
                    td.classList.remove('bg-available');
                    td.classList.add('bg-selected');
                    prevTd = td;
                    fetch(`day/${day.whn}`)
                    .then(r=>r.json())
                    .then(r=>{
                        document.querySelectorAll('#time-table tr').forEach(tr => tr.remove());
                        let timeTable = document.getElementById('time-table');
                        let date = new Date(day.whn);
                        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                        let ticketTr = document.createElement('tr');
                        ticketTr.innerHTML = `
                            <td colspan="3" id="date">
                                <label>Adult </label>
                                <input type = "number" value = 0 id = "adult">
                                <label>Child </label>
                                <input type = "number" value = 0 id = "child">
                            </td>
                        `;
                        timeTable.append(ticketTr);
                        let tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td colspan="3" id="date">${date.toLocaleString('en-US', options)}</td>
                        `;
                        timeTable.append(tr);
                        for(let x of r.availability){
                            let tr = document.createElement('tr');
                            let timeTd = document.createElement('td');
                            timeTd.innerText = x.whn.split('T')[1];
                            tr.append(timeTd);
                            let statusTd = document.createElement('td');
                            statusTd.innerText = 'Available';
                            tr.append(statusTd);
                            let btnTd = document.createElement('td');
                            //btnTd.id = 'button';
                            btnTd.innerText = 'SELECT';
                            btnTd.onclick = () => {
                                let child = document.getElementById('child').value;
                                let adult = document.getElementById('adult').value;
                                let confirmLink = `/confirm?time=${x.whn}&adult=${adult}&child=${child}`;
                                window.location.href = confirmLink;
                            }
                            tr.append(btnTd);
                            timeTable.append(tr);

                        }

                    });
                }
            }
                tr.append(td);
            }
            document.getElementById('calender-table').append(tr);
        }
    })
}

fillCalendarWithMonth(2021,10)