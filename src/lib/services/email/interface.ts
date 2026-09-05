export interface IEmailService {
  sendOrderSubmissionEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    serviceType: string,
    projectTier: string,
    consultationDate: string,
    consultationTime: string,
    projectId: string,
    trackingUrl: string,
    alreadyConsulted?: boolean
  ): Promise<void>;

  sendMeetingConfirmation(
    to: string,
    clientName: string,
    projectTitle: string,
    serviceType: string,
    projectTier: string,
    targetTimeline: string,
    meetLink: string,
    meetDate: string,
    meetTime: string
  ): Promise<void>;

  sendProposalEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    quotedPrice: number,
    downPaymentRequirement: string,
    proposalUrl: string
  ): Promise<void>;

  sendProgressUpdateEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    repoLink: string,
    stagingUrl: string,
    managementBoardUrl: string
  ): Promise<void>;

  sendSignOffRequestEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    feedbackTrackerUrl: string
  ): Promise<void>;

  sendHandoverPackageEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    productionUrl: string,
    codebaseTransferUrl: string,
    warrantyEndDate: string
  ): Promise<void>;
}
