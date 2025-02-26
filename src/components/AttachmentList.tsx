import React from 'react';
import { Attachment as AttachmentType } from '../types';
import Attachment from './Attachment';
import { getTotalAttachmentsSize, formatFileSize } from '../utils/helpers';

interface AttachmentListProps {
  attachments: AttachmentType[] | undefined;
  onAttachmentClick: (attachment: AttachmentType) => void;
}

const AttachmentList: React.FC<AttachmentListProps> = ({ 
  attachments, 
  onAttachmentClick 
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const totalSize = getTotalAttachmentsSize(attachments);

  return (
    <div className="attachments-section">
      <h2 className="attachments-title" id="attachments-heading">
        Attachments ({attachments.length}, {formatFileSize(totalSize)})
      </h2>
      <div 
        className="attachments-list" 
        role="list" 
        aria-labelledby="attachments-heading"
      >
        {attachments.map((attachment, index) => (
          <Attachment
            key={`${attachment.fileName}-${index}`}
            attachment={attachment}
            onClick={onAttachmentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentList;
