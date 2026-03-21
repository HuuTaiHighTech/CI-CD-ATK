import ContactButton from '~/components/floating-actions/contact-button';

function FloatingActions() {
  return (
    <div className='fixed right-3 bottom-3 md:right-5 md:bottom-5 flex flex-col justify-center items-center gap-5 z-5'>
      <ContactButton />
    </div>
  );
}

export default FloatingActions;
