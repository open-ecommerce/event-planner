<?php

namespace common\models;

use Yii;
use \common\models\base\Ticket as BaseTicket;
use yii\helpers\ArrayHelper;
use common\models\TicketType;
use common\models\TicketAttendance;

/**
 * This is the model class for table "ticket".
 */
class Ticket extends BaseTicket {


    public function getFullName() {
        if ($this->first_name || $this->last_name) {
            return implode(' ', [$this->first_name, $this->last_name]);
        }
        return null;
    }
    
   /**
     * @return \yii\db\ActiveQuery
     */
    public function getTicketType() {
        return $this->hasOne(TicketType::className(), ['id' => 'ticket_type_id']);
    }    

    public function getAvatar($default = null) {
        if ((empty($default)) && (empty($this->thumbnail_path))) {
            $default = "https://robohash.org/set_set1/" . $this->first_name . "?size=440x440";
            
            return "/dist/img/generic/no-author.jpg";
            
        }

        return $this->thumbnail_path ? Yii::getAlias($this->thumbnail_base_url . '/' . $this->thumbnail_path) : $default;
    }





    public function getTicketAttendandance() {
        return $this->hasOne(TicketAttendance::className(), ['id' => 'ticket_id']);
    }
}