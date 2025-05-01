const { Telegraf } = require("telegraf");
const { Markup } = require("telegraf");
const bot = new Telegraf("7694398985:AAEyzbxhLV4I5j8sW8fka4UIFLbONCEBQ70");

// Разрешённые пользователи
const allowedUsers = [1126237671];

// Массив фото-ссылок
const photoUrls = [
  "https://i.postimg.cc/sxDZMVJk/20250429-134608.jpg",
  "https://i.postimg.cc/fb0cWzKH/20250429-134613.jpg",
  "https://i.postimg.cc/x18G7ybV/20250429-134613-0.jpg",
  "https://i.postimg.cc/x1p5TFSd/20250429-134615.jpg",
  "https://i.postimg.cc/BvdC2Lb9/20250429-134616.jpg",
  "https://i.postimg.cc/wxDwcVDW/20250429-134618.jpg",
  "https://i.postimg.cc/k5VcVFnv/20250429-134619.jpg",
  "https://i.postimg.cc/Z5QPhBrB/20250429-134620.jpg",
  "https://i.postimg.cc/vHQt7dYB/20250429-134622.jpg",
  "https://i.postimg.cc/T1xqHznt/20250429-134623.jpg",
  "https://i.postimg.cc/prBYNsZR/20250429-134624.jpg",
  "https://i.postimg.cc/1R0KNzZ2/20250429-134625.jpg",
  "https://i.postimg.cc/j5P4cxnW/20250429-134626.jpg",
  "https://i.postimg.cc/g224pbQ5/20250429-134626-0.jpg",
  "https://i.postimg.cc/cLq4jxnd/20250429-133952.jpg",
  "https://i.postimg.cc/XJvVFXTk/20250429-133955.jpg",
  "https://i.postimg.cc/43WGJsm7/IMG-20250430-002854-749.jpg",
  "https://i.postimg.cc/JntL0vkT/IMG-20250430-002855-019.jpg",
  "https://i.postimg.cc/26JfZGdC/IMG-20250430-002855-185.jpg",
  "https://i.postimg.cc/Y2Gvyysf/IMG-20250430-002850-007.jpg",
  "https://i.postimg.cc/pXKpP5xm/IMG-20250430-002849-707.jpg",
  "https://i.postimg.cc/XY3XqN7Q/IMG-20250430-002842-892.jpg",
  "https://i.postimg.cc/VNk697tt/IMG-20250430-002842-900.jpg",
];


// Фейковые ссылки с названиями
const fakeLinks = [
  { title: "Ответы COP", url: "https://t.me/test_uz_ru/11908" },
  { title: "Ответы СОЧ", url: "https://t.me/test_uz_ru/11214" },
  { title: "Сайт(Test_uz_ru)", url: "https://www.test-uz.ru/" },
  { title: "Cerebry", url: "https://m.student.cerebry.co/" },
];

// Команда /start
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const messageText = ctx.message.text.trim();
  const parts = messageText.split(" ");
  console.log(userId);

  if (
    allowedUsers.includes(userId) &&
    parts.length === 2 &&
    /^\d+$/.test(parts[1])
  ) {
    const numPhotos = parseInt(parts[1], 10);

    await ctx.reply(`Начинаю отправку ${numPhotos} фото...`);

    let sent = 0;

    const interval = setInterval(async () => {
      if (sent >= numPhotos) {
        clearInterval(interval);
        return;
      }

      try {
        const photoUrl = photoUrls[sent % photoUrls.length];
        await ctx.telegram.sendPhoto(ctx.chat.id, photoUrl);
        sent++;
      } catch (err) {
        console.error("Ошибка при отправке фото:", err);
      }
    }, 400); // каждые 400 мс
  } else {
    try {
      const buttons = fakeLinks.map(({ title, url }) =>
        [Markup.button.url(title, url)]
      );

      await ctx.reply(
        "Для получения информации выберите нужный ресурс:",
        Markup.inlineKeyboard(buttons)
      );
    } catch (err) {
      console.error("Ошибка при отправке ссылок с кнопками:", err);
    }
  }
});


// Команда /id <номер> <количество>
bot.command("id", async (ctx) => {
  const userId = ctx.from.id;

  if (!allowedUsers.includes(userId)) return;

  const messageText = ctx.message.text.trim();
  const parts = messageText.split(" ");

  if (parts.length < 2 || !/^\d+$/.test(parts[1])) {
    return ctx.reply("Формат: /id <номер> <кол-во (по умолчанию 1)>");
  }

  const index = parseInt(parts[1], 10);
  const count = parts[2] && /^\d+$/.test(parts[2]) ? parseInt(parts[2], 10) : 1;

  for (let i = 0; i < count; i++) {
    const targetIndex = index + i;

    if (targetIndex < 0 || targetIndex >= photoUrls.length) {
      await ctx.reply(`Картинка с индексом ${targetIndex} не найдена.`);
    } else {
      try {
        await ctx.replyWithPhoto(photoUrls[targetIndex]);
        await new Promise((res) => setTimeout(res, 300));
      } catch (err) {
        console.error(`Ошибка при отправке фото №${targetIndex}:`, err);
      }
    }
  }
});

// Запуск бота
bot.launch();
console.log("Бот запущен");
