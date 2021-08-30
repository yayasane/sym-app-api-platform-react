<?php
namespace App\Event;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => [
                'setUserForCustomer',
                EventPriorities::PRE_VALIDATE,
            ],
        ];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        if ($result instanceof Customer && $method == 'POST') {
            //Chopper l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            //Assigner l'utilisateur au Customer qu'on est entrain de créer
            $result->setUser($user);
        }
    }
}
