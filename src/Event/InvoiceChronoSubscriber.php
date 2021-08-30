<?php
namespace App\Event;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $invoiceRepository;

    public function __construct(
        Security $security,
        InvoiceRepository $invoiceRepository
    ) {
        $this->invoiceRepository = $invoiceRepository;
        $this->security = $security;
    }
    public static function getSubscribedEvents()
    {
        return [
            ViewEvent::class => [
                'setChronoForInvoice',
                EventPriorities::PRE_VALIDATE,
            ],
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice && $method == 'POST') {
            $nextChrono = $this->invoiceRepository->findNextChrono(
                $this->security->getUser()
            );
            $result->setChrono($nextChrono);
            //TODO: A déplacer dans une classe
            if (empty($result->getSentAt())) {
                $result->setSentAt(new \DateTime());
            }
        }

        //1. J'ai besoin de l'utilisateur actuellement connecté
        //2. J'ai besoin du Repository des factures (InvoiceRepository)
        //3. Chopper la dernière facture qui a été insérée
        //4. Dans cette dernière facture, on donne le dernier chrono + 1
        // dd($event);
    }
}
