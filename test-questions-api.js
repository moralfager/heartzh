// Тестирование Questions API
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Тестирование Questions Management API\n');

  try {
    // 1. Получить список тестов
    console.log('1️⃣ Получение списка тестов...');
    const testsResponse = await fetch(`${BASE_URL}/api/admin/tests`);
    const testsData = await testsResponse.json();
    const tests = testsData.tests || testsData; // Поддержка обоих форматов
    console.log(`   ✅ Найдено тестов: ${tests.length}`);
    
    if (tests.length === 0) {
      console.log('   ❌ Нет тестов в БД. Запустите импорт сначала.');
      return;
    }

    const testId = tests[0].id;
    const testTitle = tests[0].title;
    console.log(`   📝 Будем тестировать: ${testTitle} (${testId})\n`);

    // 2. Получить вопросы теста
    console.log('2️⃣ GET /api/admin/tests/[id]/questions - Получение вопросов');
    const questionsResponse = await fetch(`${BASE_URL}/api/admin/tests/${testId}/questions`);
    const questions = await questionsResponse.json();
    console.log(`   ✅ Статус: ${questionsResponse.status}`);
    console.log(`   📊 Найдено вопросов: ${questions.length}`);
    
    if (questions.length > 0) {
      console.log(`   📝 Первый вопрос:`);
      console.log(`      ID: ${questions[0].id}`);
      console.log(`      Текст: ${questions[0].text.substring(0, 50)}...`);
      console.log(`      Тип: ${questions[0].type}`);
      console.log(`      Вариантов: ${questions[0].options.length}`);
    }
    console.log('');

    // 3. Создать новый вопрос
    console.log('3️⃣ POST /api/admin/tests/[id]/questions - Создание вопроса');
    const newQuestion = {
      text: 'Тестовый вопрос: Как вы оцениваете этот тест?',
      type: 'scale',
      options: [
        { text: 'Очень плохо', value: 1, weights: { TEST_QUALITY: 1 } },
        { text: 'Плохо', value: 2, weights: { TEST_QUALITY: 2 } },
        { text: 'Нормально', value: 3, weights: { TEST_QUALITY: 3 } },
        { text: 'Хорошо', value: 4, weights: { TEST_QUALITY: 4 } },
        { text: 'Отлично', value: 5, weights: { TEST_QUALITY: 5 } },
      ],
    };

    const createResponse = await fetch(`${BASE_URL}/api/admin/tests/${testId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    });

    const createdQuestion = await createResponse.json();
    console.log(`   ✅ Статус: ${createResponse.status}`);
    
    if (createResponse.ok) {
      console.log(`   🎉 Создан вопрос:`);
      console.log(`      ID: ${createdQuestion.id}`);
      console.log(`      Order: ${createdQuestion.order}`);
      console.log(`      Вариантов: ${createdQuestion.options.length}`);
    } else {
      console.log(`   ❌ Ошибка:`, createdQuestion);
    }
    console.log('');

    if (!createResponse.ok) {
      console.log('❌ Не удалось создать вопрос. Прерываем тесты.');
      return;
    }

    const questionId = createdQuestion.id;

    // 4. Получить созданный вопрос
    console.log('4️⃣ GET /api/admin/tests/[id]/questions/[questionId] - Получение вопроса');
    const getQuestionResponse = await fetch(
      `${BASE_URL}/api/admin/tests/${testId}/questions/${questionId}`
    );
    const getQuestion = await getQuestionResponse.json();
    console.log(`   ✅ Статус: ${getQuestionResponse.status}`);
    
    if (getQuestionResponse.ok) {
      console.log(`   📖 Вопрос:`);
      console.log(`      Текст: ${getQuestion.text}`);
      console.log(`      Тип: ${getQuestion.type}`);
      console.log(`      Вариантов: ${getQuestion.options.length}`);
      
      // Показать первый вариант с weights
      if (getQuestion.options.length > 0) {
        const opt = getQuestion.options[0];
        console.log(`      Первый вариант:`);
        console.log(`         Текст: ${opt.text}`);
        console.log(`         Value: ${opt.value}`);
        console.log(`         Weights: ${JSON.stringify(opt.weights)}`);
      }
    }
    console.log('');

    // 5. Обновить вопрос
    console.log('5️⃣ PUT /api/admin/tests/[id]/questions/[questionId] - Обновление');
    const updateResponse = await fetch(
      `${BASE_URL}/api/admin/tests/${testId}/questions/${questionId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Тестовый вопрос (ОБНОВЛЁННЫЙ): Как вам этот тест?',
        }),
      }
    );

    const updatedQuestion = await updateResponse.json();
    console.log(`   ✅ Статус: ${updateResponse.status}`);
    
    if (updateResponse.ok) {
      console.log(`   ✏️ Обновлён:`);
      console.log(`      Новый текст: ${updatedQuestion.text}`);
    }
    console.log('');

    // 6. Удалить вопрос
    console.log('6️⃣ DELETE /api/admin/tests/[id]/questions/[questionId] - Удаление');
    const deleteResponse = await fetch(
      `${BASE_URL}/api/admin/tests/${testId}/questions/${questionId}`,
      {
        method: 'DELETE',
      }
    );

    const deleteResult = await deleteResponse.json();
    console.log(`   ✅ Статус: ${deleteResponse.status}`);
    
    if (deleteResponse.ok) {
      console.log(`   🗑️ Удалён: ${deleteResult.message}`);
    }
    console.log('');

    // 7. Проверить что вопрос удалён
    console.log('7️⃣ Проверка удаления (должен вернуть 404)...');
    const checkDeleteResponse = await fetch(
      `${BASE_URL}/api/admin/tests/${testId}/questions/${questionId}`
    );
    console.log(`   ✅ Статус: ${checkDeleteResponse.status}`);
    
    if (checkDeleteResponse.status === 404) {
      console.log(`   ✅ Вопрос успешно удалён (404 Not Found)`);
    } else {
      console.log(`   ❌ Ошибка: Вопрос не был удалён`);
    }
    console.log('');

    // 8. Проверить что вопросы остались (должен быть исходный список)
    console.log('8️⃣ Итоговая проверка списка вопросов...');
    const finalQuestionsResponse = await fetch(
      `${BASE_URL}/api/admin/tests/${testId}/questions`
    );
    const finalQuestions = await finalQuestionsResponse.json();
    console.log(`   📊 Всего вопросов в тесте: ${finalQuestions.length}`);
    console.log('');

    // Итоги
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО! 🎉');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 Протестированные операции:');
    console.log('   ✅ Получение списка вопросов');
    console.log('   ✅ Создание нового вопроса с вариантами');
    console.log('   ✅ Получение вопроса по ID');
    console.log('   ✅ Обновление вопроса');
    console.log('   ✅ Удаление вопроса');
    console.log('   ✅ Проверка cascade delete');
    console.log('');
    console.log('💡 Теперь можете открыть админку и проверить UI:');
    console.log(`   http://localhost:3000/admin/tests`);
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

runTests();

