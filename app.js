/* ==========================================================================
   AESTHETIC PASTEL HABIT TRACKER INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Core State Variables
    let currentMonth = 0; // 0 = Jan, 11 = Dec
    let currentYear = 2026;
    let currentTheme = 'rose';
    
    // LocalStorage Schema Keys
    const DATA_KEY_PREFIX = 'habit_tracker_data_';
    const CONFIG_KEY = 'habit_tracker_config';
    
    // Document DOM Elements
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const themeSelect = document.getElementById('theme-select');
    
    const overallFraction = document.getElementById('overall-fraction');
    const overallPercentage = document.getElementById('overall-percentage');
    const overallProgressCircle = document.getElementById('overall-progress-circle');
    
    const topHabitsList = document.getElementById('top-habits-list');
    const habitRowsContainer = document.getElementById('habit-rows-container');
    const weekdayLetterRow = document.getElementById('weekday-letter-row');
    const dayDateRow = document.getElementById('day-date-row');
    const week5Header = document.getElementById('week-5-header');
    
    const weeklyColumnsRow = document.getElementById('weekly-columns-row');
    const weeklyMetricsList = document.getElementById('weekly-metrics-list');
    
    const monthlyProgressCircle = document.getElementById('monthly-progress-circle');
    const monthlyPercentage = document.getElementById('monthly-percentage');
    const monthlyProgressBadge = document.getElementById('monthly-progress-badge');
    const monthlyHabitsList = document.getElementById('monthly-habits-list');
    
    const reflectionTextarea = document.getElementById('reflection-textarea');
    
    const affirmationDropzone = document.getElementById('affirmation-dropzone');
    const affirmationUpload = document.getElementById('affirmation-upload');
    const affirmationImg = document.getElementById('affirmation-img');
    const affirmationPlaceholder = document.getElementById('affirmation-placeholder');
    const affirmationText = document.getElementById('affirmation-text');
    
    // SVG Circular Ring Configuration
    const overallCircleRadius = 28;
    const overallCircleCircumference = 2 * Math.PI * overallCircleRadius;
    const monthlyCircleRadius = 40;
    const monthlyCircleCircumference = 2 * Math.PI * monthlyCircleRadius;
    
    // Initialize SVG dash arrays
    overallProgressCircle.style.strokeDasharray = `${overallCircleCircumference} ${overallCircleCircumference}`;
    monthlyProgressCircle.style.strokeDasharray = `${monthlyCircleCircumference} ${monthlyCircleCircumference}`;
    
    // Default / Example Template Data (Matches the EXAMPLE worksheet)
    const DEFAULT_HABITS = [
        { name: 'Review class notes', target: 30 },
        { name: 'Complete assignments', target: 30 },
        { name: 'Organize study desk', target: 30 },
        { name: 'Read 10 pages of a book', target: 30 },
        { name: 'Exercise for 30 minutes', target: 31 },
        { name: 'Drink 8 glasses of water', target: 30 },
        { name: 'Plan next day’s schedule', target: 31 },
        { name: 'Meditate for 10 minutes', target: 31 },
        { name: 'Check emails and updates', target: 31 },
        { name: 'Practice language skills', target: 31 },
        { name: 'Review flashcards', target: 31 },
        { name: 'Write in a journal', target: 31 },
        { name: 'Solve 3 practice problems', target: 31 },
        { name: 'Connect with a classmate', target: 31 },
        { name: 'Watch an educational video', target: 31 },
        { name: 'Organize digital files', target: 31 },
        { name: 'Update to-do list', target: 31 },
        { name: 'Attend all scheduled classes', target: 31 },
        { name: 'Take a 15-minute walk', target: 10 },
        { name: 'Get at least 7 hours of sleep', target: 10 }
    ];
    
    // Expand default habits list up to 30 slots
    while (DEFAULT_HABITS.length < 30) {
        DEFAULT_HABITS.push({ name: '', target: 31 });
    }
    
    // Default Weekly Habits
    const DEFAULT_WEEKLY = {
        w1: ['Back up important files', 'Deep clean study area', 'Submit weekly assignments', 'Review last week’s lectures', ''],
        w2: ['Plan weekly finances', 'Do a weekly workout review', 'Meal prep for the week', 'Check in with a loved one', 'Take a walk outdoors'],
        w3: ['Organize weekly planner', 'Complete one hobby project', 'Call or meet family/friends', '', ''],
        w4: ['Plan weekly finances', 'Meal prep for the week', 'Do a weekly workout review', 'Check in with a loved one', 'Take a walk outdoors'],
        w5: ['Plan weekly finances', 'Have a screen-free evening', 'Meal prep for the week', 'Do a weekly workout review', '']
    };
    
    // Default Monthly Habits
    const DEFAULT_MONTHLY = [
        'Reflect on academic progress',
        'Update long-term goals',
        'Meet with academic advisor',
        'Pay bills and check finances',
        '', '', '', '', ''
    ];
    
    // Default Reflection
    const DEFAULT_REFLECTION = "This month, I felt more present in my work. I stayed consistent with my morning routine, though I want to bring more playfulness into my personal work next month. I’m proud of how I showed up—gently, intentionally, and with curiosity.";
    
    // Default Checked Checkbox States for Month June 2026 (Creating a fully functional demo)
    const SEED_MONTH = 5; // June (0-indexed)
    const SEED_YEAR = 2026;
    
    // Initialize Theme and Dates
    function init() {
        // 1. Load general configs (selected theme, month, year)
        loadGeneralConfig();
        
        // 2. Set selector values
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        themeSelect.value = currentTheme;
        setThemeClass(currentTheme);
        
        // 3. Render Calendar headers & tables
        renderCalendar();
        
        // 4. Set Event Listeners
        setEventListeners();
    }
    
    // Render the dynamic calendar days and headers
    function renderCalendar() {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        
        // Dynamic Column Span for Week 5
        const week5Days = daysInMonth - 28;
        if (week5Days > 0) {
            week5Header.style.display = '';
            week5Header.setAttribute('colspan', week5Days);
        } else {
            week5Header.style.display = 'none';
        }
        
        // Clear old calendar days in header rows
        const oldWeekdayHeaders = weekdayLetterRow.querySelectorAll('.day-col-header');
        oldWeekdayHeaders.forEach(el => el.remove());
        
        const oldDayDates = dayDateRow.querySelectorAll('.day-date-cell');
        oldDayDates.forEach(el => el.remove());
        
        // Render headers for Day 1 to N
        const weekdayInsertBefore = weekdayLetterRow.querySelector('.divider-col + .divider-col') || weekdayLetterRow.querySelectorAll('.divider-col')[1];
        const dayInsertBefore = dayDateRow.querySelector('.meta-col-end');
        
        const today = new Date();
        const isCurrentMonthYear = (today.getMonth() === currentMonth && today.getFullYear() === currentYear);
        const currentTodayDate = today.getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(currentYear, currentMonth, day);
            const weekdayString = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const weekdayLetter = weekdayString.charAt(0); // 'M', 'T', 'W'...
            
            const isToday = isCurrentMonthYear && (day === currentTodayDate);
            const todayClass = isToday ? 'today-col-highlight' : '';
            
            // Header Weekday Letter
            const weekdayTh = document.createElement('th');
            weekdayTh.className = `day-col-header day-col ${todayClass}`;
            weekdayTh.textContent = weekdayLetter;
            weekdayLetterRow.insertBefore(weekdayTh, weekdayInsertBefore);
            
            // Header Date Number
            const dateTh = document.createElement('th');
            dateTh.className = `day-date-cell day-col ${todayClass}`;
            dateTh.textContent = day;
            dayDateRow.insertBefore(dateTh, dayInsertBefore);
        }
        
        // Load data for active Month & Year
        loadMonthData();
    }
    
    // Load data for active Month & Year from localStorage
    function loadMonthData() {
        const key = `${DATA_KEY_PREFIX}${currentYear}_${currentMonth}`;
        let data = JSON.parse(localStorage.getItem(key));
        
        // Seed default dummy data if loading June 2026 for the first time
        if (!data && currentMonth === SEED_MONTH && currentYear === SEED_YEAR) {
            data = seedJune2026Data();
        }
        
        // If still no data, load clean template
        if (!data) {
            data = createCleanMonthTemplate();
        }
        
        // Render dynamic fields
        renderDailyHabits(data.dailyHabits, data.dailyChecks);
        renderWeeklyHabits(data.weeklyHabits);
        renderMonthlyHabits(data.monthlyHabits);
        
        reflectionTextarea.value = data.reflection || '';
        
        // Render Affirmation image and text
        if (data.affirmationText !== undefined) {
            affirmationText.value = data.affirmationText;
        } else if (currentMonth === SEED_MONTH && currentYear === SEED_YEAR) {
            affirmationText.value = DEFAULT_REFLECTION;
        } else {
            affirmationText.value = '';
        }
        
        if (data.affirmationImg) {
            affirmationImg.src = data.affirmationImg;
            affirmationImg.classList.remove('hidden');
            affirmationPlaceholder.classList.add('hidden');
        } else {
            affirmationImg.src = '';
            affirmationImg.classList.add('hidden');
            affirmationPlaceholder.classList.remove('hidden');
        }
        
        // Run full recalculation
        calculateDailyMetrics();
        calculateWeeklyMetrics();
        calculateMonthlyMetrics();
    }
    
    // Seed fully functional example data for June 2026
    function seedJune2026Data() {
        const data = createCleanMonthTemplate();
        
        // Seeding habit details
        for (let i = 0; i < 20; i++) {
            data.dailyHabits[i] = { ...DEFAULT_HABITS[i] };
        }
        
        // Seeding daily checklist checked statuses randomly but high-rate to make example beautiful
        // We'll mimic the high checklist density from the EXAMPLE sheet
        const checkRates = [0.5, 0.73, 0.76, 0.83, 0.83, 0.86, 0.87, 0.93, 0.96, 0.9, 0.93, 0.93, 0.8, 0.8, 0.67, 0.74, 0.54, 0.58, 1.5, 1.3];
        // Note: 1.5 and 1.3 means checking more than target! 
        // e.g. for Take a 15-min walk: target 10, checked 15.
        
        for (let hIndex = 0; hIndex < 20; hIndex++) {
            const target = data.dailyHabits[hIndex].target;
            const rate = checkRates[hIndex];
            const numToCheck = Math.min(30, Math.round(target * rate));
            
            // Randomly check days up to numToCheck
            let checkedCount = 0;
            for (let d = 1; d <= 30; d++) {
                if (checkedCount < numToCheck) {
                    // bias checks to be spread
                    if (Math.random() < 0.85 || d <= numToCheck) {
                        data.dailyChecks[hIndex][d] = true;
                        checkedCount++;
                    }
                }
            }
        }
        
        // Seeding weekly checklist details
        for (let w = 1; w <= 5; w++) {
            const wKey = `w${w}`;
            const weeklyItems = DEFAULT_WEEKLY[wKey];
            for (let i = 0; i < 5; i++) {
                data.weeklyHabits[wKey][i] = {
                    name: weeklyItems[i],
                    checked: weeklyItems[i] !== '' && i < 3 // Check first few items
                };
            }
        }
        
        // Seeding monthly checklist details
        for (let i = 0; i < 9; i++) {
            data.monthlyHabits[i] = {
                name: DEFAULT_MONTHLY[i],
                checked: DEFAULT_MONTHLY[i] !== '' && i < 2 // Check first few
            };
        }
        
        data.reflection = DEFAULT_REFLECTION;
        data.affirmationText = "Focused, intentional, and ready for the month ahead.";
        
        return data;
    }
    
    // Create clean template data for any empty month
    function createCleanMonthTemplate() {
        const habits = [];
        const checks = [];
        
        for (let i = 0; i < 30; i++) {
            // Habit metadata
            habits.push({ name: '', target: 31 });
            
            // Day 1 to 31 checks mapping
            const habitChecks = {};
            for (let d = 1; d <= 31; d++) {
                habitChecks[d] = false;
            }
            checks.push(habitChecks);
        }
        
        const weekly = {};
        for (let w = 1; w <= 5; w++) {
            weekly[`w${w}`] = [];
            for (let i = 0; i < 5; i++) {
                weekly[`w${w}`].push({ name: '', checked: false });
            }
        }
        
        const monthly = [];
        for (let i = 0; i < 9; i++) {
            monthly.push({ name: '', checked: false });
        }
        
        return {
            dailyHabits: habits,
            dailyChecks: checks,
            weeklyHabits: weekly,
            monthlyHabits: monthly,
            reflection: '',
            affirmationText: '',
            affirmationImg: ''
        };
    }
    
    // Render Daily Habits Rows
    function renderDailyHabits(habits, checks) {
        habitRowsContainer.innerHTML = '';
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        
        const today = new Date();
        const isCurrentMonthYear = (today.getMonth() === currentMonth && today.getFullYear() === currentYear);
        const currentTodayDate = today.getDate();
        
        for (let rIndex = 0; rIndex < 30; rIndex++) {
            const habit = habits[rIndex];
            const checkMap = checks[rIndex];
            
            const tr = document.createElement('tr');
            tr.dataset.row = rIndex;
            
            // 1. Number Column
            const tdNum = document.createElement('td');
            tdNum.className = 'num-col num-cell';
            tdNum.textContent = rIndex + 1;
            tr.appendChild(tdNum);
            
            // 2. Habit Name Input Column
            const tdName = document.createElement('td');
            tdName.className = 'habit-name-col habit-name-cell';
            
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.className = 'habit-input';
            inputName.value = habit.name;
            inputName.placeholder = `Habit ${rIndex + 1}...`;
            inputName.dataset.type = 'name';
            tdName.appendChild(inputName);
            tr.appendChild(tdName);
            
            // 3. Divider Column
            const tdDiv1 = document.createElement('td');
            tdDiv1.className = 'divider-col divider-cell left-divider';
            tr.appendChild(tdDiv1);
            
            // 4. Days 1 to 31 Checkbox Columns
            for (let day = 1; day <= daysInMonth; day++) {
                const tdDay = document.createElement('td');
                const isToday = isCurrentMonthYear && (day === currentTodayDate);
                const todayClass = isToday ? 'today-col-highlight' : '';
                
                tdDay.className = `day-col day-cell ${todayClass}`;
                
                const chkContainer = document.createElement('div');
                chkContainer.className = `day-cell-checkbox ${checkMap[day] ? 'checked' : ''}`;
                chkContainer.dataset.day = day;
                
                const chkIndicator = document.createElement('div');
                chkIndicator.className = 'checkbox-custom';
                
                chkContainer.appendChild(chkIndicator);
                tdDay.appendChild(chkContainer);
                tr.appendChild(tdDay);
            }
            
            // 5. Divider Column End
            const tdDiv2 = document.createElement('td');
            tdDiv2.className = 'divider-col divider-cell right-divider';
            tr.appendChild(tdDiv2);
            
            // 6. Target Goal Numeric Input Column
            const tdGoal = document.createElement('td');
            tdGoal.className = 'goal-col';
            
            const inputGoal = document.createElement('input');
            inputGoal.type = 'number';
            inputGoal.className = 'goal-input';
            inputGoal.value = habit.target;
            inputGoal.min = 1;
            inputGoal.max = 31;
            inputGoal.dataset.type = 'target';
            tdGoal.appendChild(inputGoal);
            tr.appendChild(tdGoal);
            
            // 7. Percentage Column
            const tdPct = document.createElement('td');
            tdPct.className = 'pct-col pct-cell';
            tdPct.textContent = '0%';
            tr.appendChild(tdPct);
            
            // 8. Progress Sparkline Column
            const tdBar = document.createElement('td');
            tdBar.className = 'progress-col bar-cell';
            
            const sparkBg = document.createElement('div');
            sparkBg.className = 'sparkbar-container';
            
            const sparkFill = document.createElement('div');
            sparkFill.className = 'sparkbar-fill';
            
            sparkBg.appendChild(sparkFill);
            tdBar.appendChild(sparkBg);
            tr.appendChild(tdBar);
            
            // 9. Count Column
            const tdCount = document.createElement('td');
            tdCount.className = 'count-col count-cell';
            tdCount.textContent = '0 / 31';
            tr.appendChild(tdCount);
            
            // 10. Longest Streak Column
            const tdStreak = document.createElement('td');
            tdStreak.className = 'streak-col streak-cell';
            tdStreak.innerHTML = '0 <i class="fa-solid fa-fire" style="display:none"></i>';
            tr.appendChild(tdStreak);
            
            habitRowsContainer.appendChild(tr);
        }
    }
    
    // Render Weekly Habits
    function renderWeeklyHabits(weeklyData) {
        weeklyColumnsRow.innerHTML = '';
        
        for (let w = 1; w <= 5; w++) {
            const wKey = `w${w}`;
            const weekItems = weeklyData[wKey];
            
            const colDiv = document.createElement('div');
            colDiv.className = 'weekly-week-col';
            colDiv.dataset.week = w;
            
            const titleDiv = document.createElement('div');
            titleDiv.className = 'weekly-week-title';
            titleDiv.textContent = `week ${w}`;
            colDiv.appendChild(titleDiv);
            
            const listUl = document.createElement('ul');
            listUl.className = 'weekly-habits-checklist';
            
            for (let i = 0; i < 5; i++) {
                const habit = weekItems[i] || { name: '', checked: false };
                
                const li = document.createElement('li');
                li.className = `weekly-habit-item ${habit.checked ? 'checked' : ''}`;
                li.dataset.index = i;
                
                const miniBox = document.createElement('div');
                miniBox.className = 'checkbox-mini';
                li.appendChild(miniBox);
                
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'weekly-habit-text-input';
                input.value = habit.name;
                input.placeholder = `Weekly Habit ${i+1}...`;
                li.appendChild(input);
                
                listUl.appendChild(li);
            }
            
            colDiv.appendChild(listUl);
            weeklyColumnsRow.appendChild(colDiv);
        }
    }
    
    // Render Monthly Habits List
    function renderMonthlyHabits(monthlyData) {
        monthlyHabitsList.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const habit = monthlyData[i] || { name: '', checked: false };
            
            const li = document.createElement('li');
            li.className = `monthly-habit-item ${habit.checked ? 'checked' : ''}`;
            li.dataset.index = i;
            
            const miniBox = document.createElement('div');
            miniBox.className = 'checkbox-mini';
            li.appendChild(miniBox);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'monthly-habit-input';
            input.value = habit.name;
            input.placeholder = `Monthly Goal ${i+1}...`;
            li.appendChild(input);
            
            monthlyHabitsList.appendChild(li);
        }
    }
    
    // Set Event Listeners for Controls
    function setEventListeners() {
        // Month Selector Change
        monthSelect.addEventListener('change', (e) => {
            saveCurrentMonthData();
            currentMonth = parseInt(e.target.value);
            saveGeneralConfig();
            renderCalendar();
        });
        
        // Year Selector Change
        yearSelect.addEventListener('change', (e) => {
            saveCurrentMonthData();
            currentYear = parseInt(e.target.value);
            saveGeneralConfig();
            renderCalendar();
        });
        
        // Theme Selector Change
        themeSelect.addEventListener('change', (e) => {
            currentTheme = e.target.value;
            saveGeneralConfig();
            setThemeClass(currentTheme);
        });
        
        // Textarea auto-save on input
        reflectionTextarea.addEventListener('input', () => {
            saveCurrentMonthData();
        });
        
        affirmationText.addEventListener('input', () => {
            saveCurrentMonthData();
        });
        
        // Affirmation image dropzone click/upload
        affirmationDropzone.addEventListener('click', () => {
            affirmationUpload.click();
        });
        
        affirmationUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    affirmationImg.src = event.target.result;
                    affirmationImg.classList.remove('hidden');
                    affirmationPlaceholder.classList.add('hidden');
                    saveCurrentMonthData();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Table Checklist / Input events (Delegated)
        habitRowsContainer.addEventListener('click', (e) => {
            const checkbox = e.target.closest('.day-cell-checkbox');
            if (checkbox) {
                checkbox.classList.toggle('checked');
                saveCurrentMonthData();
                calculateDailyMetrics();
            }
        });
        
        // Input text name changes and numeric target goal changes
        habitRowsContainer.addEventListener('change', (e) => {
            const input = e.target.closest('.habit-input, .goal-input');
            if (input) {
                saveCurrentMonthData();
                calculateDailyMetrics();
            }
        });
        
        // Keyboard Shortcuts: Ctrl+A on checkboxes to check/uncheck all
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                const active = document.activeElement;
                // If focus is inside a textbox, let it handle space standardly
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
                    return;
                }
                
                // Toggle clicked on hovered checkbox if applicable
                // Or simply support a global fast select/toggle. 
                // Let's implement check-all for hovered rows:
            }
        });
        
        // Weekly Habits Checklist clicks/inputs
        weeklyColumnsRow.addEventListener('click', (e) => {
            const miniBox = e.target.closest('.checkbox-mini');
            if (miniBox) {
                const item = miniBox.closest('.weekly-habit-item');
                item.classList.toggle('checked');
                saveCurrentMonthData();
                calculateWeeklyMetrics();
            }
        });
        
        weeklyColumnsRow.addEventListener('change', (e) => {
            const textInput = e.target.closest('.weekly-habit-text-input');
            if (textInput) {
                saveCurrentMonthData();
                calculateWeeklyMetrics();
            }
        });
        
        // Monthly Habits Checklist clicks/inputs
        monthlyHabitsList.addEventListener('click', (e) => {
            const miniBox = e.target.closest('.checkbox-mini');
            if (miniBox) {
                const item = miniBox.closest('.monthly-habit-item');
                item.classList.toggle('checked');
                saveCurrentMonthData();
                calculateMonthlyMetrics();
            }
        });
        
        monthlyHabitsList.addEventListener('change', (e) => {
            const input = e.target.closest('.monthly-habit-input');
            if (input) {
                saveCurrentMonthData();
                calculateMonthlyMetrics();
            }
        });
    }
    
    // Set Theme Class on Body
    function setThemeClass(theme) {
        document.body.className = `theme-${theme}`;
    }
    
    // ==========================================================================
    // METRICS CALCULATION AND RENDER ENGINE
    // ==========================================================================
    
    // Recalculates all daily habit completion metrics, streaks, progress bars, and Top 10 lists
    function calculateDailyMetrics() {
        const rows = habitRowsContainer.querySelectorAll('tr');
        let totalChecked = 0;
        let totalTargetSum = 0;
        
        const habitsList = [];
        
        rows.forEach(row => {
            const rIndex = parseInt(row.dataset.row);
            const nameInput = row.querySelector('.habit-input');
            const goalInput = row.querySelector('.goal-input');
            const pctCell = row.querySelector('.pct-cell');
            const sparkFill = row.querySelector('.sparkbar-fill');
            const countCell = row.querySelector('.count-cell');
            const streakCell = row.querySelector('.streak-col');
            
            const habitName = nameInput.value.trim();
            const target = Math.max(1, parseInt(goalInput.value) || 31);
            
            // Count checked checkboxes
            const checkedBoxes = row.querySelectorAll('.day-cell-checkbox.checked');
            const countChecked = checkedBoxes.length;
            
            // Calculate percentage
            const percentage = target > 0 ? (countChecked / target) : 0;
            const pctString = Math.round(percentage * 100) + '%';
            
            pctCell.textContent = pctString;
            countCell.textContent = `${countChecked} / ${target}`;
            
            // Render progress bar fill
            const displayPercentage = Math.min(100, Math.round(percentage * 100));
            sparkFill.style.width = `${displayPercentage}%`;
            
            // Calculate streak
            const streak = calculateLongestStreak(row);
            if (streak > 0) {
                streakCell.innerHTML = `${streak} <i class="fa-solid fa-fire"></i>`;
            } else {
                streakCell.innerHTML = '0 <i class="fa-solid fa-fire" style="display:none"></i>';
            }
            
            // Highlight complete
            if (percentage >= 1 && habitName !== '') {
                pctCell.classList.add('completed-metric');
            } else {
                pctCell.classList.remove('completed-metric');
            }
            
            if (habitName !== '') {
                totalChecked += countChecked;
                totalTargetSum += target;
                
                habitsList.push({
                    name: habitName,
                    progress: percentage,
                    pctText: pctString
                });
            }
        });
        
        // Update top overall dashboard metrics
        overallFraction.textContent = `${totalChecked} / ${totalTargetSum}`;
        
        const overallPercentageValue = totalTargetSum > 0 ? Math.round((totalChecked / totalTargetSum) * 100) : 0;
        overallPercentage.textContent = `${overallPercentageValue}%`;
        
        // SVG progress ring offset calculation
        const offset = overallCircleCircumference - (overallPercentageValue / 100) * overallCircleCircumference;
        overallProgressCircle.style.strokeDashoffset = offset;
        
        // Update the sorted Top 10 Habits Dashboard in the Sidebar
        renderTop10Dashboard(habitsList);
    }
    
    // Streak Finder Logic: Counts maximum consecutive checked daily boxes
    function calculateLongestStreak(row) {
        const checkboxes = row.querySelectorAll('.day-cell-checkbox');
        let maxStreak = 0;
        let currentStreak = 0;
        
        checkboxes.forEach(chk => {
            if (chk.classList.contains('checked')) {
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
            }
        });
        
        return maxStreak;
    }
    
    // Sorts all active habits and renders the Top 10 list
    function renderTop10Dashboard(habitsList) {
        // Sort in descending order
        habitsList.sort((a, b) => b.progress - a.progress);
        
        topHabitsList.innerHTML = '';
        
        // Grab top 10
        const top10 = habitsList.slice(0, 10);
        
        if (top10.length === 0) {
            topHabitsList.innerHTML = '<li class="top-habits-subtitle" style="text-align:center; margin-top:1rem">No active habits</li>';
            return;
        }
        
        top10.forEach((h, index) => {
            const li = document.createElement('li');
            const isCompleted = h.progress >= 1;
            
            li.className = `top-habit-item ${isCompleted ? 'completed' : ''}`;
            
            const displayProgress = Math.min(100, Math.round(h.progress * 100));
            
            li.innerHTML = `
                <div class="top-habit-meta">
                    <span class="top-habit-name">${index + 1} &nbsp; ${escapeHTML(h.name)}</span>
                    <span class="top-habit-percentage">${h.pctText}</span>
                </div>
                <div class="top-habit-bar-bg">
                    <div class="top-habit-bar-fill" style="width: ${displayProgress}%"></div>
                </div>
            `;
            
            topHabitsList.appendChild(li);
        });
    }
    
    // Recalculates Weekly checklist metrics
    function calculateWeeklyMetrics() {
        const weeks = weeklyColumnsRow.querySelectorAll('.weekly-week-col');
        
        let grandTotalChecked = 0;
        let grandTotalCount = 0;
        
        weeklyMetricsList.innerHTML = '';
        
        weeks.forEach(col => {
            const wNum = col.dataset.week;
            const items = col.querySelectorAll('.weekly-habit-item');
            
            let checked = 0;
            let total = 0;
            
            items.forEach(li => {
                const textInput = li.querySelector('.weekly-habit-text-input').value.trim();
                if (textInput !== '') {
                    total++;
                    if (li.classList.contains('checked')) {
                        checked++;
                    }
                }
            });
            
            grandTotalChecked += checked;
            grandTotalCount += total;
            
            // Add weekly progress row inside weekly progress dashboard
            const row = document.createElement('div');
            row.className = 'weekly-metric-row';
            
            const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
            
            row.innerHTML = `
                <span>week ${wNum} progress</span>
                <span class="weekly-metric-value">${checked} / ${total} &nbsp;(${pct}%)</span>
            `;
            
            weeklyMetricsList.appendChild(row);
        });
        
        // Add Grand Total Weekly Progress Row
        const overallRow = document.createElement('div');
        overallRow.className = 'weekly-metric-row overall';
        
        const grandPct = grandTotalCount > 0 ? Math.round((grandTotalChecked / grandTotalCount) * 100) : 0;
        overallRow.innerHTML = `
            <span>WEEKLY PROGRESS</span>
            <span class="weekly-metric-value">${grandTotalChecked} / ${grandTotalCount} &nbsp;(${grandPct}%)</span>
        `;
        
        weeklyMetricsList.appendChild(overallRow);
    }
    
    // Recalculates Monthly Goals Checklist progress
    function calculateMonthlyMetrics() {
        const items = monthlyHabitsList.querySelectorAll('.monthly-habit-item');
        
        let checked = 0;
        let total = 0;
        
        items.forEach(li => {
            const inputVal = li.querySelector('.monthly-habit-input').value.trim();
            if (inputVal !== '') {
                total++;
                if (li.classList.contains('checked')) {
                    checked++;
                }
            }
        });
        
        monthlyProgressBadge.textContent = `${checked} / ${total} completed`;
        
        const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
        monthlyPercentage.textContent = `${pct}%`;
        
        // Update SVG Progress Ring
        const offset = monthlyCircleCircumference - (pct / 100) * monthlyCircleCircumference;
        monthlyProgressCircle.style.strokeDashoffset = offset;
    }
    
    // ==========================================================================
    // PERSISTENCE ENGINE (LOAD & SAVE LOCAL STORAGE)
    // ==========================================================================
    
    // Save current active state data into storage
    function saveCurrentMonthData() {
        const key = `${DATA_KEY_PREFIX}${currentYear}_${currentMonth}`;
        
        const dailyHabits = [];
        const dailyChecks = [];
        
        const rows = habitRowsContainer.querySelectorAll('tr');
        rows.forEach(row => {
            const nameInput = row.querySelector('.habit-input').value.trim();
            const goalInput = parseInt(row.querySelector('.goal-input').value) || 31;
            dailyHabits.push({ name: nameInput, target: goalInput });
            
            const checkMap = {};
            const chkContainers = row.querySelectorAll('.day-cell-checkbox');
            chkContainers.forEach(container => {
                const day = container.dataset.day;
                checkMap[day] = container.classList.contains('checked');
            });
            dailyChecks.push(checkMap);
        });
        
        const weekly = {};
        const weekCols = weeklyColumnsRow.querySelectorAll('.weekly-week-col');
        weekCols.forEach(col => {
            const wNum = col.dataset.week;
            const wKey = `w${wNum}`;
            weekly[wKey] = [];
            
            const items = col.querySelectorAll('.weekly-habit-item');
            items.forEach(item => {
                const name = item.querySelector('.weekly-habit-text-input').value.trim();
                const checked = item.classList.contains('checked');
                weekly[wKey].push({ name, checked });
            });
        });
        
        const monthly = [];
        const monthlyItems = monthlyHabitsList.querySelectorAll('.monthly-habit-item');
        monthlyItems.forEach(item => {
            const name = item.querySelector('.monthly-habit-input').value.trim();
            const checked = item.classList.contains('checked');
            monthly.push({ name, checked });
        });
        
        const reflection = reflectionTextarea.value;
        const textAffirmation = affirmationText.value;
        const imgAffirmation = affirmationImg.classList.contains('hidden') ? '' : affirmationImg.src;
        
        const monthData = {
            dailyHabits,
            dailyChecks,
            weeklyHabits: weekly,
            monthlyHabits: monthly,
            reflection,
            affirmationText: textAffirmation,
            affirmationImg: imgAffirmation
        };
        
        localStorage.setItem(key, JSON.stringify(monthData));
    }
    
    // Save general configs
    function saveGeneralConfig() {
        const config = {
            month: currentMonth,
            year: currentYear,
            theme: currentTheme
        };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }
    
    // Load general configs
    function loadGeneralConfig() {
        const config = JSON.parse(localStorage.getItem(CONFIG_KEY));
        if (config) {
            currentMonth = config.month !== undefined ? config.month : 0;
            currentYear = config.year !== undefined ? config.year : 2026;
            currentTheme = config.theme || 'rose';
        } else {
            // Default settings matching June 2026 seed
            currentMonth = SEED_MONTH;
            currentYear = SEED_YEAR;
            currentTheme = 'rose';
        }
    }
    
    // ==========================================================================
    // UTILITY HELPER METHODS
    // ==========================================================================
    
    // Calculates days in a month (Variable months + leap years)
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    // Escapes special HTML tags to prevent cross-site scripting
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
    
    // Trigger initialization
    init();
});
