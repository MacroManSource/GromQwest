/**
 * BaoPulse — Posts CRUD & Interactions
 */
import { supabase } from './supabase.js';
import { getState } from './state.js';
import { showToast, extractHashtags, linkifyContent, formatRelativeTime, formatNumber } from './utils.js';
import { CONFIG } from './config.js';

export async function createPost({ content, mediaFiles = [], replyToId = null, quoteOfId = null }) {
  const { user, profile } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  if (!content.trim() && mediaFiles.length === 0) {
    return { error: 'Публикация не может быть пустой' };
  }
  if (content.length > CONFIG.MAX_POST_LENGTH) {
    return { error: `Максимум ${CONFIG.MAX_POST_LENGTH} символов` };
  }

  const isReply = !!replyToId;
  const isQuote = !!quoteOfId;

  // 1. Insert post
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      content: content.trim(),
      reply_to_id: replyToId,
      quote_of_id: quoteOfId,
      is_reply: isReply,
      is_quote: isQuote,
      is_repost: false
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // 2. Upload media
  if (mediaFiles.length > 0) {
    const mediaRecords = [];
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${post.id}/${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('post-media').getPublicUrl(path);
      mediaRecords.push({
        post_id: post.id,
        storage_path: path,
        public_url: publicUrl,
        media_type: file.type.includes('gif') ? 'gif' : 'image',
        position: i
      });
    }

    if (mediaRecords.length) {
      await supabase.from('post_media').insert(mediaRecords);
    }
  }

  // 3. Hashtags
  const tags = extractHashtags(content);
  for (const tag of tags) {
    let { data: hashtag } = await supabase
      .from('hashtags')
      .select('id')
      .eq('tag', tag)
      .maybeSingle();

    if (!hashtag) {
      const { data: newTag } = await supabase
        .from('hashtags')
        .insert({ tag })
        .select('id')
        .single();
      hashtag = newTag;
    }

    if (hashtag) {
      await supabase.from('post_hashtags').insert({ post_id: post.id, hashtag_id: hashtag.id });
    }
  }

  // 4. Notification for reply
  if (isReply && replyToId) {
    const { data: parent } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', replyToId)
      .single();

    if (parent && parent.author_id !== user.id) {
      await supabase.from('notifications').insert({
        recipient_id: parent.author_id,
        actor_id: user.id,
        type: 'reply',
        post_id: post.id
      });
    }
  }

  return { data: post };
}

export async function deletePost(postId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  // Soft delete
  const { error } = await supabase
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', postId)
    .eq('author_id', user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleLike(postId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  const { data: existing } = await supabase
    .from('likes')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId);
    return { liked: false };
  } else {
    await supabase.from('likes').insert({ user_id: user.id, post_id: postId });

    // Notify
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (post && post.author_id !== user.id) {
      await supabase.from('notifications').insert({
        recipient_id: post.author_id,
        actor_id: user.id,
        type: 'like',
        post_id: postId
      });
    }
    return { liked: true };
  }
}

export async function toggleRepost(postId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  const { data: existing } = await supabase
    .from('reposts')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    await supabase.from('reposts').delete().eq('user_id', user.id).eq('post_id', postId);
    return { reposted: false };
  } else {
    await supabase.from('reposts').insert({ user_id: user.id, post_id: postId });

    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (post && post.author_id !== user.id) {
      await supabase.from('notifications').insert({
        recipient_id: post.author_id,
        actor_id: user.id,
        type: 'repost',
        post_id: postId
      });
    }
    return { reposted: true };
  }
}

export async function toggleBookmark(postId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);
    return { bookmarked: false };
  } else {
    await supabase.from('bookmarks').insert({ user_id: user.id, post_id: postId });
    return { bookmarked: true };
  }
}

export async function getPost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, username, display_name, avatar_url, is_verified),
      media:post_media(*),
      reply_to:posts!reply_to_id(id, content, author:profiles!author_id(username, display_name))
    `)
    .eq('id', postId)
    .is('deleted_at', null)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getReplies(postId, cursor = null, limit = 20) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, username, display_name, avatar_url, is_verified),
      media:post_media(*)
    `)
    .eq('reply_to_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (cursor) {
    query = query.gt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data };
}

/**
 * Render a single post card HTML
 */
export function renderPostCard(post, options = {}) {
  const { user } = getState();
  const author = post.author || {};
  const media = post.media || [];
  const isOwn = user && user.id === post.author_id;

  const mediaHtml = media.length
    ? `<div class="post-media ${media.length > 1 ? 'grid' : ''}">
        ${media.map(m => `<img src="${m.public_url}" alt="" loading="lazy" class="post-image">`).join('')}
      </div>`
    : '';

  return `
    <article class="post-card" data-post-id="${post.id}">
      <a href="#/u/${author.username}" class="post-avatar">
        <img src="${author.avatar_url || '/assets/default-avatar.svg'}" alt="" loading="lazy">
      </a>
      <div class="post-body">
        <header class="post-header">
          <a href="#/u/${author.username}" class="post-author">
            <span class="display-name">${escape(author.display_name)}</span>
            ${author.is_verified ? '<span class="verified">✓</span>' : ''}
            <span class="username">@${author.username}</span>
          </a>
          <time datetime="${post.created_at}">${formatRelativeTime(post.created_at)}</time>
          ${isOwn ? `<button class="btn-icon post-menu" data-action="menu" aria-label="Меню">⋯</button>` : ''}
        </header>
        ${post.reply_to ? `<div class="reply-context">В ответ <a href="#/u/${post.reply_to.author?.username}">@${post.reply_to.author?.username}</a></div>` : ''}
        <div class="post-content">${linkifyContent(post.content)}</div>
        ${mediaHtml}
        <footer class="post-actions">
          <button class="action-btn" data-action="reply" title="Ответить">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>
            <span>${formatNumber(post.replies_count || 0)}</span>
          </button>
          <button class="action-btn" data-action="repost" title="Репост">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 1l4 4-4 4V6H9a3 3 0 00-3 3v3H4V9a5 5 0 015-5h8V1zm-10 22l-4-4 4-4v3h8a3 3 0 003-3v-3h2v3a5 5 0 01-5 5H7v3z"/></svg>
            <span>${formatNumber(post.reposts_count || 0)}</span>
          </button>
          <button class="action-btn like-btn" data-action="like" title="Нравится">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>${formatNumber(post.likes_count || 0)}</span>
          </button>
          <button class="action-btn" data-action="bookmark" title="В закладки">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          </button>
          <button class="action-btn" data-action="share" title="Поделиться">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
          </button>
        </footer>
      </div>
    </article>
  `;
}

function escape(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
