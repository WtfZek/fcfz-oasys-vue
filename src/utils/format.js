// 格式化日期为 YYYY-MM-DD
export const formatDate = (date) => {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date; // 如果已经是格式化的日期，直接返回
    }

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 格式化时间为 HH:MM:SS
export const formatTime = (isoString) => {
    if (typeof isoString === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(isoString)) {
        return isoString; // 如果已经是格式化的时间，直接返回
    }

    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

// 格式化日期时间为 YYYY-MM-DD HH:MM:SS
export const formatDateTime = (isoString) => {
    if (typeof isoString === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(isoString)) {
        return isoString; // 如果已经是格式化的日期时间，直接返回
    }

    const date = new Date(isoString);

    // 格式化日期部分
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // 格式化时间部分
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 返回完整的日期+时间格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 将 YYYY-MM-DD HH:MM:SS 格式的日期时间字符串转换为 ISO8601 格式
export const parseToISO8601 = (formattedString) => {
    // 如果已经是 ISO8601 格式，直接返回
    if (typeof formattedString === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[Z|+-]\d{2}:\d{2}$/.test(formattedString)) {
        return formattedString;
    }

    // 检查是否符合格式 YYYY-MM-DD HH:MM:SS
    if (typeof formattedString !== 'string' || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(formattedString)) {
        throw new Error('输入的日期格式必须为 YYYY-MM-DD HH:MM:SS 或 ISO8601');
    }

    // 将字符串分解为日期和时间
    const [datePart, timePart] = formattedString.split(' ');

    // 拼接为 ISO8601 格式
    const isoString = `${datePart}T${timePart}.000Z`; // 假设是 UTC 时间，使用 "Z" 表示时区

    // 检查是否有效
    const parsedDate = new Date(isoString);
    if (isNaN(parsedDate)) {
        throw new Error('输入的日期时间无效');
    }

    return isoString;
};

