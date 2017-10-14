<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210733_mail_store extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%mail_store}}',
            [
                'mail_id'=> $this->primaryKey(11),
                'subject'=> $this->string(250)->null()->defaultValue(null),
                'message_body'=> $this->text()->null()->defaultValue(null),
                'to'=> $this->text()->null()->defaultValue(null),
                'from'=> $this->string(250)->null()->defaultValue(null),
                'cc'=> $this->text()->null()->defaultValue(null),
                'bcc'=> $this->text()->null()->defaultValue(null),
                'attachments'=> $this->text()->null()->defaultValue(null),
                'created_date'=> $this->date()->null()->defaultValue(null),
                'status'=> $this->string(50)->null()->defaultValue(null),
                'unique_id'=> $this->string(250)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%mail_store}}');
    }
}
