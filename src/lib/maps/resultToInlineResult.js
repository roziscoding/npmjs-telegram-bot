export default function(r) {
    return {
        type: 'article',
        id: r.name,
        title: `${r.name}@${r.version}`,
        description: r.description,
        url: r.link,
        input_message_content: {
            message_text: `[${r.name}@${r.version}](${r.link})\n${r.description}`,
            parse_mode: 'Markdown'
        }
    };
}
