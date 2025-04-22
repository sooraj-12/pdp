// Handle disease input visibility
document.addEventListener('DOMContentLoaded', function() {
    const diseaseRadioYes = document.querySelector('input[name="disease"][value="yes"]');
    const diseaseRadioNo = document.querySelector('input[name="disease"][value="no"]');
    const diseaseInput = document.getElementById('diseaseInput');
    
    if (diseaseRadioYes && diseaseRadioNo && diseaseInput) {
        diseaseRadioYes.addEventListener('change', function() {
            if (this.checked) {
                diseaseInput.style.display = 'block';
            }
        });
        
        diseaseRadioNo.addEventListener('change', function() {
            if (this.checked) {
                diseaseInput.style.display = 'none';
                document.getElementById('diseaseName').value = '';
            }
        });
    }
    
    // Handle form submission
    const bmiForm = document.getElementById('bmiForm');
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBMI();
        });
    }
    
    // Display results if we're on the results page
    if (window.location.pathname.includes('results.html')) {
        displayResults();
    }
});

function calculateBMI() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const hasDisease = document.querySelector('input[name="disease"]:checked').value === 'yes';
    const diseaseName = hasDisease ? document.getElementById('diseaseName').value : '';
    
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let category;
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
    } else {
        category = 'Overweight';
    }
    
    // Store data in localStorage to pass to results page
    localStorage.setItem('userData', JSON.stringify({
        name,
        age,
        gender,
        height,
        weight,
        bmi: bmi.toFixed(1),
        category,
        hasDisease,
        diseaseName
    }));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

function displayResults() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'bmi-calculator.html';
        return;
    }
    
    // Display user info
    document.getElementById('userInfo').innerHTML = `
        <h3>User Information</h3>
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Age:</strong> ${userData.age}</p>
        <p><strong>Gender:</strong> ${userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)}</p>
        <p><strong>Height:</strong> ${userData.height} cm</p>
        <p><strong>Weight:</strong> ${userData.weight} kg</p>
        ${userData.hasDisease ? <p><strong>Medical Condition:</strong> ${userData.diseaseName}</p> : ''}
    `;
    
    // Display BMI result
    let bmiMessage;
    if (userData.category === 'Underweight') {
        bmiMessage = Your BMI suggests you are underweight. Consider increasing your calorie intake with nutrient-dense foods.;
    } else if (userData.category === 'Normal weight') {
        bmiMessage = Congratulations! Your BMI is in the healthy range. Maintain your current habits for continued health.;
    } else {
        bmiMessage = Your BMI suggests you are overweight. Consider making dietary changes and increasing physical activity.;
    }
    
    document.getElementById('bmiResult').innerHTML = `
        <h3>Hello,${userData.name}!</h3>
        <p>Based on your input, here are your results:</p>
        <div class="bmi"><p> ${userData.bmi}</p></div>
        <div class="category"><p><strong> ${userData.category}</strong></p></div>
        <p>${bmiMessage}</p>
    `;
    
    // Display diet plan
    let dietPlanContent = '';
    
    if (userData.category === 'Underweight') {
        dietPlanContent = `
            <div class="diet-category">
                <h4>Diet Plan for Underweight Individuals</h4>
                <p>To gain weight healthily, focus on nutrient-dense foods that provide calories and essential nutrients:</p>
                <ul>
                    <li><strong>Increase calorie intake:</strong> Add healthy fats like avocados, nuts, seeds, and olive oil to meals</li>
                    <li><strong>Protein-rich foods:</strong> Include lean meats, fish, eggs, dairy, legumes, and protein shakes</li>
                    <li><strong>Frequent meals:</strong> Eat 5-6 smaller meals throughout the day if large meals are unappealing</li>
                    <li><strong>Healthy snacks:</strong> Trail mix, cheese and crackers, nut butters with fruit</li>
                    <li><strong>Strength training:</strong> Combine with increased protein to build muscle mass</li>
                </ul>
            </div>
        `;
    } else if (userData.category === 'Normal weight') {
        dietPlanContent = `
            <div class="diet-category">
                <h4>Diet Plan for Maintaining Healthy Weight</h4>
                <p>To maintain your healthy weight while getting all necessary nutrients:</p>
                <ul>
                    <li><strong>Balanced meals:</strong> Include protein, healthy fats, and complex carbs in each meal</li>
                    <li><strong>Variety of fruits and vegetables:</strong> Aim for different colors to get various nutrients</li>
                    <li><strong>Whole grains:</strong> Choose brown rice, quinoa, whole wheat bread over refined grains</li>
                    <li><strong>Healthy fats:</strong> Avocados, nuts, seeds, olive oil, and fatty fish</li>
                    <li><strong>Portion control:</strong> Be mindful of serving sizes to maintain current weight</li>
                    <li><strong>Regular exercise:</strong> Combine cardio and strength training for overall health</li>
                </ul>
            </div>
        `;
    } else {
        dietPlanContent = `
            <div class="diet-category">
                <h4>Diet Plan for Overweight Individuals</h4>
                <p>To achieve healthy weight loss, focus on nutrient-rich, lower-calorie foods:</p>
                <ul>
                    <li><strong>Portion control:</strong> Use smaller plates and be mindful of serving sizes</li>
                    <li><strong>High-fiber foods:</strong> Vegetables, fruits, whole grains, and legumes to promote fullness</li>
                    <li><strong>Lean proteins:</strong> Chicken, turkey, fish, tofu, and legumes to maintain muscle</li>
                    <li><strong>Limit processed foods:</strong> Reduce intake of sugary drinks, snacks, and fast food</li>
                    <li><strong>Healthy cooking methods:</strong> Bake, grill, steam instead of frying</li>
                    <li><strong>Regular physical activity:</strong> Aim for at least 150 minutes of moderate exercise weekly</li>
                </ul>
            </div>
        `;
    }
    
    // Add disease-specific modifications if applicable
    if (userData.hasDisease) {
        let diseaseModification = '';
        
        if (userData.diseaseName.toLowerCase().includes('diabetes')) {
            diseaseModification = `
                <div class="diet-category">
                    <h4>Diabetes-Specific Modifications</h4>
                    <ul>
                        <li><strong>Carbohydrate management:</strong> Monitor carb intake and spread evenly throughout the day</li>
                        <li><strong>Low glycemic index foods:</strong> Choose whole grains, non-starchy vegetables, and legumes</li>
                        <li><strong>Limit added sugars:</strong> Avoid sugary drinks and desserts</li>
                        <li><strong>Healthy fats:</strong> Focus on unsaturated fats from nuts, seeds, and fish</li>
                        <li><strong>Regular meal times:</strong> Eat at consistent times to help manage blood sugar</li>
                    </ul>
                </div>
            `;
        } else if (userData.diseaseName.toLowerCase().includes('hypertension') || userData.diseaseName.toLowerCase().includes('high blood pressure')) {
            diseaseModification = `
                <div class="diet-category">
                    <h4>Hypertension-Specific Modifications</h4>
                    <ul>
                        <li><strong>Reduce sodium:</strong> Limit processed foods and added salt</li>
                        <li><strong>Increase potassium:</strong> Bananas, sweet potatoes, spinach, and other potassium-rich foods</li>
                        <li><strong>DASH diet principles:</strong> Emphasize fruits, vegetables, whole grains, and low-fat dairy</li>
                        <li><strong>Limit alcohol:</strong> No more than one drink per day for women, two for men</li>
                        <li><strong>Maintain healthy weight:</strong> Weight loss can significantly lower blood pressure</li>
                    </ul>
                </div>
            `;
        } else if (userData.diseaseName.toLowerCase().includes('cholesterol') || userData.diseaseName.toLowerCase().includes('heart')) {
            diseaseModification = `
                <div class="diet-category">
                    <h4>Heart-Healthy Modifications</h4>
                    <ul>
                        <li><strong>Reduce saturated fats:</strong> Limit red meat, full-fat dairy, and fried foods</li>
                        <li><strong>Increase omega-3s:</strong> Fatty fish, flaxseeds, and walnuts</li>
                        <li><strong>Soluble fiber:</strong> Oats, beans, lentils, and apples to help lower cholesterol</li>
                        <li><strong>Plant sterols:</strong> Found in fortified foods to help reduce LDL cholesterol</li>
                        <li><strong>Limit trans fats:</strong> Avoid partially hydrogenated oils</li>
                    </ul>
                </div>
            `;
        } else {
            diseaseModification = `
                <div class="diet-category">
                    <h4>General Modifications for ${userData.diseaseName}</h4>
                    <p>For your specific condition (${userData.diseaseName}), consider these additional dietary adjustments:</p>
                    <ul>
                        <li>Consult with a registered dietitian for personalized advice</li>
                        <li>Monitor any foods that may interact with medications</li>
                        <li>Stay hydrated and maintain electrolyte balance if needed</li>
                        <li>Consider any nutrient deficiencies common with your condition</li>
                        <li>Follow any specific dietary guidelines provided by your healthcare provider</li>
                    </ul>
                </div>
            `;
        }
        
        dietPlanContent += diseaseModification;
    }
    
    document.getElementById('planContent').innerHTML = dietPlanContent;
}
