export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-xl border border-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'opacity-25 bg-gray-300' : 'bg-gradient-to-r from-[#0d7a6a] to-[#1abc9c] hover:from-[#0a6b5c] hover:to-[#16a085] hover:shadow-lg hover:shadow-[rgba(13,122,106,0.3)] focus:from-[#0a6b5c] focus:to-[#16a085] active:from-[#095a4f] active:to-[#0d7a6a]'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
