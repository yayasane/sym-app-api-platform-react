<?php
namespace App\Event;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    /**
     * @var UserPasswordHasherInterface
     */
    private $passwordHasher;
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => [
                'encodePassword',
                EventPriorities::PRE_WRITE,
            ],
        ];
    }

    public function encodePassword(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        // dd($result);

        if ($result instanceof User && $method == 'POST') {
            $hashedPassword = $this->passwordHasher->hashPassword(
                $result,
                $result->getPassword()
            );

            $result->setPassword($hashedPassword);
        }
    }
}
