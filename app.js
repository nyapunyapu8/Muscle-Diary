// ページ遷移関数
function navigateToRecord() {
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('record-page').classList.add('active');
}

function navigateToGraph() {
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('graph-page').classList.add('active');
    updateGraphs();
}

function navigateToMotivation() {
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('motivation-page').classList.add('active');
    showMotivationMessage();
}

function navigateToHome() {
    document.getElementById('record-page').classList.remove('active');
    document.getElementById('graph-page').classList.remove('active');
    document.getElementById('motivation-page').classList.remove('active');
    document.getElementById('home-page').classList.add('active');
}

// モチベーションメッセージの配列
const motivationMessages = [
    "今日も頑張ろう！",
    "少しずつ進歩が積み重なるよ",
    "あなたの努力は必ず報われる",
    "今日の1日を大切に",
    "小さな一歩が大きな結果を生む",
    "あなたの頑張りが未来を変える",
    "今日も1日、自分のために",
    "自分のペースで進もう",
    "小さな変化が大切",
    "継続は力なり",
    "一歩ずつ前に進もう",
    "あなたの努力は必ず報われる",
    "小さな進歩を大切に",
    "目標に向かって進もう",
    "自分の成長を信じよう",
    "今日も1日、頑張ったね！"
];

// ランダムなモチベーションメッセージを表示
function showMotivationMessage() {
    const message = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
    document.getElementById('motivation-message').textContent = message;
    document.getElementById('daily-message').textContent = message;
}

// 次のメッセージを表示
function showNextMessage() {
    const currentMessage = document.getElementById('daily-message').textContent;
    const currentIndex = motivationMessages.indexOf(currentMessage);
    const nextIndex = (currentIndex + 1) % motivationMessages.length;
    document.getElementById('daily-message').textContent = motivationMessages[nextIndex];
}

// グラフの更新
function updateGraphs() {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    
    // 日付順にソート
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // データの準備
    const dates = records.map(record => new Date(record.date).toLocaleDateString());
    const weights = records.map(record => parseFloat(record.weight) || 0);
    const bodyfats = records.map(record => parseFloat(record.bodyfat) || 0);
    const muscles = records.map(record => parseFloat(record.muscle) || 0);
    
    // 体重グラフ
    new Chart(document.getElementById('weight-graph'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '体重（kg）',
                data: weights,
                borderColor: '#4CAF50',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // 体脂肪率グラフ
    new Chart(document.getElementById('bodyfat-graph'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '体脂肪率（%）',
                data: bodyfats,
                borderColor: '#2196F3',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    max: 50
                }
            }
        }
    });
    
    // 筋肉量グラフ
    new Chart(document.getElementById('muscle-graph'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '筋肉量（kg）',
                data: muscles,
                borderColor: '#f44336',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // パンダのコメントを更新
    updatePandaComment(weights, bodyfats, muscles);
}

// パンダのコメントを更新
function updatePandaComment(weights, bodyfats, muscles) {
    const latest = {
        weight: weights[weights.length - 1],
        bodyfat: bodyfats[bodyfats.length - 1],
        muscle: muscles[muscles.length - 1]
    };
    
    let comment = "進捗を確認して、目標に向かって頑張ろう！";
    
    if (latest.weight && latest.bodyfat && latest.muscle) {
        const weightChange = weights.length > 1 ? (latest.weight - weights[0]) / weights[0] * 100 : 0;
        const bodyfatChange = bodyfats.length > 1 ? (latest.bodyfat - bodyfats[0]) / bodyfats[0] * 100 : 0;
        const muscleChange = muscles.length > 1 ? (latest.muscle - muscles[0]) / muscles[0] * 100 : 0;
        
        if (weightChange < -1 && bodyfatChange < -1 && muscleChange > 1) {
            comment = "素晴らしい！体重と体脂肪率が減って、筋肉量が増えていますね！";
        } else if (weightChange > 1 && bodyfatChange > 1 && muscleChange < -1) {
            comment = "体重と体脂肪率が増えていますね。バランスを意識して頑張りましょう！";
        } else if (weightChange < 1 && bodyfatChange < 1 && muscleChange < 1) {
            comment = "全体的に減少傾向ですね。栄養バランスを確認してみましょう！";
        }
    }
    
    document.getElementById('panda-comment').textContent = comment;
}

// フォームの送信処理
document.getElementById('record-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // フォームデータを取得
    const formData = {
        weight: document.getElementById('weight').value,
        bodyfat: document.getElementById('bodyfat').value,
        mood: document.getElementById('mood').value,
        muscle: document.getElementById('muscle').value,
        protein: document.getElementById('protein').value,
        fat: document.getElementById('fat').value,
        carb: document.getElementById('carb').value,
        exercise: document.getElementById('exercise').value,
        fatigue: document.getElementById('fatigue').value,
        memo: document.getElementById('memo').value
    };
    
    // データを保存（ローカルストレージに保存）
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    records.push({
        ...formData,
        date: new Date().toISOString()
    });
    localStorage.setItem('records', JSON.stringify(records));
    
    // 成功メッセージを表示
    alert('記録が保存されました！');
    
    // ホームページに戻る
    navigateToHome();
    
    // フォームをリセット
    this.reset();
});

// 初期化
window.addEventListener('load', function() {
    showMotivationMessage();
});
