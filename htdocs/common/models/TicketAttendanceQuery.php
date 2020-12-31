<?php

namespace common\models;

/**
 * This is the ActiveQuery class for [[TicketAttendance]].
 *
 * @see TicketAttendance
 */
class TicketAttendanceQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return TicketAttendance[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return TicketAttendance|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
