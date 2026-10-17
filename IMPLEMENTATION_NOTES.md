# Внедрение в BaoMudao

## Рекомендуемое хранение
Для профиля можно добавить поля:
- `status_id` или `status_ids` — отображаемые статусы;
- `avatar_frame_id` — выбранная рамка;
- `avatar_effect_id` — выбранный эффект;
- `profile_banner_id` — выбранная обложка;
- `profile_theme_id` — тема профиля.

Не ломайте текущие поля профиля: `profiles.username`, `profiles.avatar_url`, `profiles.alliance_tag`. Связь профиля с Auth должна оставаться через `profiles.id = auth.users.id`.

## Лучше разделить каталог и выбор пользователя
1. Каталог косметики хранится в таблицах `cosmetics` / `cosmetic_catalog` либо в кодовом JSON.
2. Разблокировки хранятся отдельно в `user_cosmetics` (user_id, cosmetic_id, unlocked_at, source).
3. Выбор внешнего вида — в профиле пользователя или таблице `user_cosmetic_settings`.
4. Проверяйте, что пользователь действительно разблокировал предмет перед тем, как разрешить его выбрать.

## Роли и безопасность
- Статусы `administrator`, `moderator` и `verified` назначаются только серверной логикой или администратором.
- Не доверяйте значениям из браузера; применяйте RLS в Supabase и серверные проверки.
- Для косметических предметов используйте allowlist ID из каталога.
- При удалении предмета сохраняйте безопасный fallback на стандартное оформление.

## UI
- Рамка должна быть отдельным SVG-слоем поверх круглого аватара; сам аватар обрезается кругом.
- Обложка профиля — `background-size: cover` или отдельный `<img>` с `object-fit: cover`.
- Статус рядом с ником лучше показывать компактным бейджем, не более 1–2 основных статусов одновременно.
- Дайте пользователю отключать декоративные эффекты и выбирать стандартный вид.
- Учитывайте доступность: достаточный контраст, reduced-motion, alt/aria-label для значимых элементов.

## Пример HTML рамки
```html
<div class="avatar">
  <img class="avatar__photo" src="avatar.jpg" alt="">
  <img class="avatar__frame" src="/cosmetics/avatar_frames/bamboo.svg" alt="">
</div>
```
```css
.avatar { position: relative; width: 96px; aspect-ratio: 1; }
.avatar__photo { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.avatar__frame { position: absolute; inset: -4%; width: 108%; height: 108%; pointer-events: none; }
```
