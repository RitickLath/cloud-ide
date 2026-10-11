export { cn } from "cn"

export const getLanguageFromExtension = (extension: string) => {
    switch (extension.toLowerCase()) {
        case 'js':
        case 'jsx':
        case 'mjs':
        case 'cjs':
            return 'javascript'
        case 'ts':
        case 'tsx':
            return 'typescript'
        case 'json':
            return 'json'
        case 'html':
            return 'html'
        case 'css':
            return 'css'
        case 'md':
            return 'markdown'
        case 'py':
            return 'python'
        case 'sh':
            return 'shell'
        default:
            return 'plaintext'
    }
}
